import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { RedemptionHistory } from "../types/reward";
import { userDashboardKeys } from "@/app/user/dashboard/hooks/dashboardQueries";
import { userProfileKeys } from "@/app/user/profil/hooks/profileQueries";
import {
  USER_REWARD_HISTORY_ITEMS_PER_PAGE,
  fetchRewardHistory,
  fetchUserRewardBootstrap,
  getCurrentUserId,
  userRewardKeys,
} from "./rewardQueries";

export function useUserRewards() {
  // State pagination history
  const [historyPage, setHistoryPage] = useState(1);
  // State filter katalog
  const [activeCategory, setActiveCategory] = useState("Semua");
  // State detail card yang sedang dibuka
  const [expandedRewardId, setExpandedRewardId] = useState<number | null>(null);
  // State detail redemption dari history
  const [selectedHistory, setSelectedHistory] = useState<RedemptionHistory | null>(null);
  const [processingRewardId, setProcessingRewardId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const queryClient = useQueryClient();

  // Helper format rupiah
  const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);

  // Helper format tanggal history
  const formatDateTime = (value: string) => {
    const date = new Date(value);
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Helper normalisasi relasi Supabase: bisa object atau array.
  const pickFirstRelation = <T,>(value: T | T[] | null | undefined): T | null => {
    if (!value) return null;
    return Array.isArray(value) ? (value[0] ?? null) : value;
  };

  const bootstrapQuery = useQuery({
    queryKey: userRewardKeys.bootstrap,
    queryFn: fetchUserRewardBootstrap,
    staleTime: 60 * 1000,
  });

  const historyQuery = useQuery({
    queryKey: userRewardKeys.history(historyPage),
    queryFn: async () => {
      const userId = bootstrapQuery.data?.userId ?? (await getCurrentUserId());
      return fetchRewardHistory(userId, historyPage);
    },
    enabled: !!bootstrapQuery.data?.userId,
    staleTime: 30 * 1000,
  });

  const userId = bootstrapQuery.data?.userId ?? null;
  const profile = bootstrapQuery.data?.profile ?? null;
  const rewards = useMemo(() => bootstrapQuery.data?.rewards ?? [], [bootstrapQuery.data?.rewards]);
  const totalRedeemedAmount = bootstrapQuery.data?.totalRedeemedAmount ?? 0;
  const history = historyQuery.data?.rows ?? [];
  const totalHistoryData = historyQuery.data?.totalData ?? 0;
  const totalHistoryPages = Math.max(1, Math.ceil(totalHistoryData / USER_REWARD_HISTORY_ITEMS_PER_PAGE));

  // Ambil daftar kategori unik dari reward aktif
  const categories = useMemo(() => {
    const mapped = rewards.map((item) => item.reward_category || "Lainnya");
    return ["Semua", ...Array.from(new Set(mapped))];
  }, [rewards]);

  // Filter katalog berdasarkan kategori aktif
  const filteredRewards = useMemo(() => {
    if (activeCategory === "Semua") return rewards;
    return rewards.filter((item) => item.reward_category === activeCategory);
  }, [rewards, activeCategory]);

  // Proses redeem reward: potong poin, kurangi stok, assign kode jika perlu, catat transaksi
  const handleRedeem = async (rewardId: number) => {
    if (!userId) {
      setMessage({ type: "error", text: "User tidak ditemukan." });
      return;
    }

    setProcessingRewardId(rewardId);
    setMessage(null);

    try {
      const { data, error } = await supabase.rpc("redeem_user_reward", {
        p_user_id: userId,
        p_reward_id: rewardId,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setMessage({
        type: "success",
        text: data.code
          ? `Redeem berhasil. Kode kamu: ${data.code}`
          : "Redeem berhasil. Reward diproses manual.",
      });

      setHistoryPage(1);

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: userRewardKeys.all }),
        queryClient.invalidateQueries({ queryKey: userDashboardKeys.all }),
        queryClient.invalidateQueries({ queryKey: userProfileKeys.all }),
      ]);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Gagal redeem reward",
      });
    } finally {
      setProcessingRewardId(null);
    }
  };

  return {
    // data
    profile,
    filteredRewards,
    categories,
    history,
    totalRedeemedAmount,
    selectedHistory,

    // ui state
    loading: bootstrapQuery.isLoading,
    historyLoading: historyQuery.isLoading,
    processingRewardId,
    message,
    activeCategory,
    expandedRewardId,

    // pagination
    historyPage,
    totalHistoryPages,

    // helpers
    formatRupiah,
    formatDateTime,
    pickFirstRelation,

    // setters/actions
    setActiveCategory,
    setExpandedRewardId,
    setSelectedHistory,
    setHistoryPage,
    handleRedeem,
  };
}
