import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { adminQueryKeys } from "@/app/admin/queryKeys";
import { AuditSummary, RedemptionQueryRow, RedemptionRow, Reward } from "../types/reward";

const ITEMS_PER_PAGE = 5;

const pickFirstRelation = <T,>(value: T | T[] | null | undefined): T | null => {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
};

async function fetchRewards(): Promise<Reward[]> {
  const { data, error } = await supabase
    .from("rewards")
    .select(
      "id, title, description, reward_category, partner_name, redemption_note, fulfillment_type, points_required, amount_value, stock, is_active, image_url, created_at",
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as Reward[]) || [];
}

async function fetchRedemptions(currentPage: number): Promise<{ rows: RedemptionRow[]; totalData: number }> {
  const from = (currentPage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  const { data, error, count } = await supabase
    .from("redemptions")
    .select(
      `
        id,
        points_spent,
        amount_added,
        status,
        fulfillment_status,
        fulfillment_code,
        created_at,
        profiles:profiles!redemptions_user_id_fkey(full_name, email),
        rewards:rewards!redemptions_reward_id_fkey(title, reward_category)
      `,
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  const rows: RedemptionRow[] = ((data as RedemptionQueryRow[]) || []).map((row) => ({
    id: row.id,
    points_spent: row.points_spent,
    amount_added: row.amount_added,
    status: row.status,
    fulfillment_status: row.fulfillment_status,
    fulfillment_code: row.fulfillment_code,
    created_at: row.created_at,
    profile: pickFirstRelation(row.profiles),
    reward: pickFirstRelation(row.rewards),
  }));

  return {
    rows,
    totalData: count || 0,
  };
}

async function fetchMonthlyAudit(): Promise<AuditSummary> {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const { data, error } = await supabase
    .from("redemptions")
    .select("points_spent, amount_added")
    .eq("status", "completed")
    .gte("created_at", monthStart);

  if (error) throw error;

  const pointsSpent = (data || []).reduce((acc, item) => acc + (item.points_spent || 0), 0);
  const amountAdded = (data || []).reduce((acc, item) => acc + (item.amount_added || 0), 0);

  return {
    pointsSpent,
    amountAdded,
    totalTx: (data || []).length,
  };
}

export function useRewardAdmin() {
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [editStock, setEditStock] = useState(0);
  const [editPoints, setEditPoints] = useState(0);
  const queryClient = useQueryClient();

  const rewardsQuery = useQuery({
    queryKey: adminQueryKeys.reward.catalog,
    queryFn: fetchRewards,
    staleTime: 60 * 1000,
  });

  const redemptionsQuery = useQuery({
    queryKey: adminQueryKeys.reward.transactions(currentPage),
    queryFn: () => fetchRedemptions(currentPage),
    staleTime: 30 * 1000,
  });

  const monthlyAuditQuery = useQuery({
    queryKey: adminQueryKeys.reward.audit("monthly"),
    queryFn: fetchMonthlyAudit,
    staleTime: 60 * 1000,
  });

  const rewards = rewardsQuery.data || [];
  const redemptions = redemptionsQuery.data?.rows || [];
  const totalData = redemptionsQuery.data?.totalData || 0;
  const monthlyAudit = monthlyAuditQuery.data || {
    pointsSpent: 0,
    amountAdded: 0,
    totalTx: 0,
  };
  const totalPages = Math.ceil(totalData / ITEMS_PER_PAGE);

  // Generate kode otomatis untuk menambah pool kode saat stok reward bertipe code dinaikkan.
  const generateAutoCodes = (count: number, reward: Reward): string[] => {
    const sourceLabel = (reward.partner_name || reward.reward_category || reward.title || "RWD")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 4) || "RWD";

    const nominalLabel = Math.max(1, reward.amount_value).toString().slice(0, 4);
    const generated = new Set<string>();

    while (generated.size < count) {
      const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
      generated.add(`${sourceLabel}${nominalLabel}-${randomPart}`);
    }

    return Array.from(generated);
  };

  // Katalog menampilkan semua reward (aktif + nonaktif)
  const catalogRewards = useMemo(() => rewards, [rewards]);

  // Handler buka modal edit stock/harga poin
  const openEditModal = (reward: Reward) => {
    setEditingReward(reward);
    setEditStock(reward.stock ?? 0);
    setEditPoints(reward.points_required);
  };

  // Handler simpan update stok dan harga poin
  const handleSaveEdit = async () => {
    if (!editingReward) return;

    // Khusus reward bertipe code: sinkronkan jumlah kode dengan stok terbaru.
    if (editingReward.fulfillment_type === "code") {
      const { data: codesData, error: codesError } = await supabase
        .from("reward_codes")
        .select("id, is_used, created_at")
        .eq("reward_id", editingReward.id)
        .order("created_at", { ascending: false });

      if (codesError) {
        setMessage({ type: "error", text: `Gagal memuat pool kode: ${codesError.message}` });
        return;
      }

      const allCodes = codesData || [];
      const usedCodes = allCodes.filter((item) => item.is_used);
      const unusedCodes = allCodes.filter((item) => !item.is_used);

      // Jangan izinkan stok lebih kecil dari kode yang sudah terpakai.
      if (editStock < usedCodes.length) {
        setMessage({
          type: "error",
          text: `Stok tidak boleh kurang dari jumlah kode terpakai (${usedCodes.length}).`,
        });
        return;
      }

      const targetUnusedCodes = editStock - usedCodes.length;

      // Jika stok naik, tambahkan kode baru otomatis.
      if (targetUnusedCodes > unusedCodes.length) {
        const needToGenerate = targetUnusedCodes - unusedCodes.length;
        const generatedCodes = generateAutoCodes(needToGenerate, editingReward);

        const rows = generatedCodes.map((code) => ({
          reward_id: editingReward.id,
          code,
        }));

        const { error: insertCodesError } = await supabase
          .from("reward_codes")
          .insert(rows);

        if (insertCodesError) {
          setMessage({ type: "error", text: `Gagal menambah kode otomatis: ${insertCodesError.message}` });
          return;
        }
      }

      // Jika stok turun, hapus sebagian kode unused (tidak menyentuh kode used).
      if (targetUnusedCodes < unusedCodes.length) {
        const removeCount = unusedCodes.length - targetUnusedCodes;
        const idsToDelete = unusedCodes.slice(0, removeCount).map((item) => item.id);

        if (idsToDelete.length > 0) {
          const { error: deleteCodesError } = await supabase
            .from("reward_codes")
            .delete()
            .in("id", idsToDelete);

          if (deleteCodesError) {
            setMessage({ type: "error", text: `Gagal mengurangi pool kode: ${deleteCodesError.message}` });
            return;
          }
        }
      }
    }

    const { error } = await supabase
      .from("rewards")
      .update({
        stock: editStock,
        points_required: editPoints,
      })
      .eq("id", editingReward.id);

    if (error) {
      setMessage({ type: "error", text: `Gagal update reward: ${error.message}` });
      return;
    }

    setMessage({ type: "success", text: "Reward berhasil diperbarui." });
    setEditingReward(null);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.reward.catalog }),
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.reward.audit("monthly") }),
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.reward.transactions(currentPage) }),
    ]);
  };

  // Handler toggle status aktif reward (aktif <-> nonaktif)
  const handleToggleRewardActive = async (reward: Reward) => {
    const nextActiveState = !reward.is_active;
    const confirmMessage = nextActiveState
      ? "Yakin ingin mengaktifkan reward ini kembali?"
      : "Yakin ingin menonaktifkan reward ini?";

    const confirmToggle = confirm(confirmMessage);
    if (!confirmToggle) return;

    const { error } = await supabase
      .from("rewards")
      .update({ is_active: nextActiveState })
      .eq("id", reward.id);

    if (error) {
      setMessage({ type: "error", text: `Gagal update status reward: ${error.message}` });
      return;
    }

    setMessage({
      type: "success",
      text: nextActiveState
        ? "Reward berhasil diaktifkan kembali."
        : "Reward berhasil dinonaktifkan.",
    });

    await queryClient.invalidateQueries({ queryKey: adminQueryKeys.reward.catalog });
  };

  return {
    rewards,
    redemptions,
    loadingRewards: rewardsQuery.isLoading,
    loadingRedemptions: redemptionsQuery.isLoading,
    currentPage,
    setCurrentPage,
    totalPages,
    monthlyAudit,
    message,
    editingReward,
    editStock,
    setEditStock,
    editPoints,
    setEditPoints,
    catalogRewards,
    setEditingReward,
    openEditModal,
    handleSaveEdit,
    handleToggleRewardActive,
  };
}
