import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { RedemptionHistory, Reward, UserProfile } from "../types/reward";

const ITEMS_PER_PAGE = 5;

export function useUserRewards() {
  // State user login dan profil poin
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // State daftar reward aktif
  const [rewards, setRewards] = useState<Reward[]>([]);

  // State history penukaran user
  const [history, setHistory] = useState<RedemptionHistory[]>([]);
  const [totalRedeemedAmount, setTotalRedeemedAmount] = useState(0);

  // State pagination history
  const [historyPage, setHistoryPage] = useState(1);
  const [totalHistoryData, setTotalHistoryData] = useState(0);
  const totalHistoryPages = Math.ceil(totalHistoryData / ITEMS_PER_PAGE);

  // State filter katalog
  const [activeCategory, setActiveCategory] = useState("Semua");

  // State detail card yang sedang dibuka
  const [expandedRewardId, setExpandedRewardId] = useState<number | null>(null);

  // State detail redemption dari history
  const [selectedHistory, setSelectedHistory] = useState<RedemptionHistory | null>(null);

  // State loading UI
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [processingRewardId, setProcessingRewardId] = useState<number | null>(null);

  // State feedback pesan sukses/error
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

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

  // Ambil profil user aktif
  const fetchProfile = useCallback(async (currentUserId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, total_points")
      .eq("id", currentUserId)
      .single();

    if (error || !data) {
      setMessage({ type: "error", text: "Gagal memuat profil user." });
      return;
    }

    setProfile(data as UserProfile);
  }, []);

  // Ambil reward yang bisa ditukar user (hanya aktif + stok tersedia)
  const fetchRewards = useCallback(async () => {
    const { data, error } = await supabase
      .from("rewards")
      .select(
        "id, title, description, reward_category, partner_name, redemption_note, fulfillment_type, points_required, amount_value, stock, image_url, is_active",
      )
      .eq("is_active", true)
      .gt("stock", 0)
      .order("created_at", { ascending: false });

    if (error) {
      setMessage({ type: "error", text: `Gagal memuat reward: ${error.message}` });
      return;
    }

    setRewards((data as Reward[]) || []);
  }, []);

  // Ambil history redeem user dengan pagination
  const fetchHistory = useCallback(async (currentUserId: string, page: number) => {
    setHistoryLoading(true);

    const from = (page - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    const { data, error, count } = await supabase
      .from("redemptions")
      .select(
        "id, created_at, points_spent, amount_added, fulfillment_status, fulfillment_code, rewards:rewards!redemptions_reward_id_fkey(title, reward_category, partner_name, redemption_note, fulfillment_type)",
        { count: "exact" },
      )
      .eq("user_id", currentUserId)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      setHistory([]);
      setTotalHistoryData(0);
      setHistoryLoading(false);
      return;
    }

    setHistory((data as RedemptionHistory[]) || []);
    setTotalHistoryData(count || 0);
    setHistoryLoading(false);
  }, []);

  // Ambil total nominal redeem user untuk ringkasan
  const fetchTotalRedeemedAmount = useCallback(async (currentUserId: string) => {
    const { data, error } = await supabase
      .from("redemptions")
      .select("amount_added")
      .eq("user_id", currentUserId)
      .eq("status", "completed");

    if (error) {
      setTotalRedeemedAmount(0);
      return;
    }

    const totalAmount = (data || []).reduce((acc, item) => acc + (item.amount_added || 0), 0);
    setTotalRedeemedAmount(totalAmount);
  }, []);

  // Bootstrap awal halaman
  const bootstrapData = useCallback(async () => {
    setLoading(true);
    setMessage(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage({ type: "error", text: "Sesi user tidak ditemukan. Silakan login ulang." });
      setLoading(false);
      return;
    }

    setUserId(user.id);

    await Promise.all([
      fetchProfile(user.id),
      fetchRewards(),
      fetchHistory(user.id, 1),
      fetchTotalRedeemedAmount(user.id),
    ]);

    setLoading(false);
  }, [fetchProfile, fetchRewards, fetchHistory, fetchTotalRedeemedAmount]);

  useEffect(() => {
    const timer = setTimeout(() => {
      bootstrapData();
    }, 0);

    return () => clearTimeout(timer);
  }, [bootstrapData]);

  // Reload history saat page berubah
  useEffect(() => {
    if (!userId) return;

    const timer = setTimeout(() => {
      fetchHistory(userId, historyPage);
    }, 0);

    return () => clearTimeout(timer);
  }, [fetchHistory, historyPage, userId]);

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

      const currentPoints = profile.total_points || 0;
      if (currentPoints < rewardData.points_required) {
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

      // 4) Update poin user
      const newPoints = currentPoints - rewardData.points_required;
      const { error: updateProfileError } = await supabase
        .from("profiles")
        .update({ total_points: newPoints })
        .eq("id", userId);

      if (updateProfileError) {
        throw new Error(`Gagal update poin user: ${updateProfileError.message}`);
      }

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

      // 6) Refresh data agar UI langsung sinkron
      setHistoryPage(1);
      await Promise.all([
        fetchProfile(userId),
        fetchRewards(),
        fetchHistory(userId, 1),
        fetchTotalRedeemedAmount(userId),
      ]);
    } catch (error: unknown) {
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
    rewards,
    filteredRewards,
    categories,
    history,
    totalRedeemedAmount,
    selectedHistory,

    // ui state
    loading,
    historyLoading,
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
