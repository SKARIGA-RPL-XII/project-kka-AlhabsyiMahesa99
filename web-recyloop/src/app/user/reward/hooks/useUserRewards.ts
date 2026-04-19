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
    if (!userId || !profile) {
      setMessage({ type: "error", text: "Data user belum siap." });
      return;
    }

    setMessage(null);
    setProcessingRewardId(rewardId);

    let lockedCodeId: number | null = null;
    let rewardDataSnapshot: { id: number; stock: number | null } | null = null;
    const currentPointsSnapshot = profile.total_points || 0;
    let rewardStockChanged = false;
    let profilePointsChanged = false;

    try {
      // 1) Ambil data reward terbaru
      const { data: rewardData, error: rewardError } = await supabase
        .from("rewards")
        .select("id, title, points_required, amount_value, stock, is_active, fulfillment_type")
        .eq("id", rewardId)
        .single();

      if (rewardError || !rewardData) {
        throw new Error("Reward tidak ditemukan.");
      }

      if (!rewardData.is_active || (rewardData.stock || 0) <= 0) {
        throw new Error("Reward tidak tersedia atau stok habis.");
      }

      rewardDataSnapshot = { id: rewardData.id, stock: rewardData.stock };

      if (currentPointsSnapshot < rewardData.points_required) {
        throw new Error("Poin kamu belum cukup untuk reward ini.");
      }

      // 2) Assign kode jika reward bertipe code
      let assignedCode: string | null = null;
      let fulfillmentStatus = "completed";

      if (rewardData.fulfillment_type === "code") {
        const { data: codeData, error: codeError } = await supabase
          .from("reward_codes")
          .select("id, code")
          .eq("reward_id", rewardData.id)
          .eq("is_used", false)
          .limit(1)
          .maybeSingle();

        if (codeError) {
          throw new Error(`Gagal mengambil kode reward: ${codeError.message}`);
        }

        if (!codeData) {
          throw new Error("Kode reward habis. Hubungi admin untuk refill kode.");
        }

        assignedCode = codeData.code;
        lockedCodeId = codeData.id;

        const { error: updateCodeError } = await supabase
          .from("reward_codes")
          .update({
            is_used: true,
            used_at: new Date().toISOString(),
          })
          .eq("id", codeData.id);

        if (updateCodeError) {
          throw new Error(`Gagal mengunci kode reward: ${updateCodeError.message}`);
        }
      } else {
        // Reward manual menunggu proses/admin follow-up
        fulfillmentStatus = "pending_manual";
      }

      // 3) Update stock reward
      const { error: updateRewardError } = await supabase
        .from("rewards")
        .update({ stock: (rewardData.stock || 0) - 1 })
        .eq("id", rewardData.id);

      if (updateRewardError) {
        throw new Error(`Gagal update stok reward: ${updateRewardError.message}`);
      }
      rewardStockChanged = true;

      // 4) Update poin user
      const newPoints = currentPointsSnapshot - rewardData.points_required;
      const { error: updateProfileError } = await supabase
        .from("profiles")
        .update({ total_points: newPoints })
        .eq("id", userId);

      if (updateProfileError) {
        throw new Error(`Gagal update poin user: ${updateProfileError.message}`);
      }
      profilePointsChanged = true;

      // 5) Insert log redemption untuk audit admin + detail user
      const { error: insertRedemptionError } = await supabase
        .from("redemptions")
        .insert({
          user_id: userId,
          reward_id: rewardData.id,
          points_spent: rewardData.points_required,
          amount_added: rewardData.amount_value,
          fulfillment_status: fulfillmentStatus,
          fulfillment_code: assignedCode,
          status: "completed",
        });

      if (insertRedemptionError) {
        throw new Error(`Gagal menyimpan log penukaran: ${insertRedemptionError.message}`);
      }

      setMessage({
        type: "success",
        text: assignedCode
          ? `Redeem berhasil. Kode kamu: ${assignedCode}`
          : "Redeem berhasil. Reward diproses manual oleh admin.",
      });

      setHistoryPage(1);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: userRewardKeys.all }),
        queryClient.invalidateQueries({ queryKey: userDashboardKeys.all }),
        queryClient.invalidateQueries({ queryKey: userProfileKeys.all }),
      ]);
    } catch (error: unknown) {
      const rollbackTasks: Promise<unknown>[] = [];

      if (profilePointsChanged) {
        rollbackTasks.push(
          (async () => {
            await supabase.from("profiles").update({ total_points: currentPointsSnapshot }).eq("id", userId);
          })(),
        );
      }

      if (rewardStockChanged && rewardDataSnapshot) {
        rollbackTasks.push(
          (async () => {
            await supabase.from("rewards").update({ stock: rewardDataSnapshot.stock }).eq("id", rewardDataSnapshot.id);
          })(),
        );
      }

      if (lockedCodeId) {
        rollbackTasks.push(
          (async () => {
            await supabase
              .from("reward_codes")
              .update({ is_used: false, used_at: null })
              .eq("id", lockedCodeId);
          })(),
        );
      }

      if (rollbackTasks.length > 0) {
        const rollbackResults = await Promise.allSettled(rollbackTasks);
        const failedRollback = rollbackResults.some((result) => result.status === "rejected");

        if (failedRollback) {
          console.error("Rollback redeem gagal sepenuhnya.", rollbackResults);
        }
      }

      const errorMessage =
        error instanceof Error ? error.message : "Terjadi kesalahan saat redeem reward.";
      setMessage({ type: "error", text: errorMessage });
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
