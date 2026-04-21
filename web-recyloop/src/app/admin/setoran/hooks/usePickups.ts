import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { adminQueryKeys } from "@/app/admin/queryKeys";
import { PickupItem, PickupRow, PickupStatus } from "@/types/pickup";

export const ITEMS_PER_PAGE = 5;

type AdminPickupsQueryResult = {
  pickups: PickupItem[];
  totalData: number;
};

async function fetchAdminPickups(currentPage: number, activeStatus: "all" | PickupStatus): Promise<AdminPickupsQueryResult> {
  const from = (currentPage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  let query = supabase
    .from("pickups")
    .select(
      `
      id,
      user_id,
      created_at,
      status,
      total_weight,
      total_points_earned,
      pickup_address,
      estimated_weight,
      notes,
      user:profiles!pickups_user_id_fkey(full_name, phone),
      kurir:profiles!pickups_kurir_id_fkey(full_name, phone),
      kategori:waste_categories!pickups_waste_category_id_fkey(name, points_per_kg)
    `,
      { count: "exact" },
    )
    .range(from, to)
    .order("created_at", { ascending: false });

  if (activeStatus !== "all") {
    query = query.eq("status", activeStatus);
  }

  const { data, error, count } = await query;
  if (error) throw error;

  const pickups: PickupItem[] = ((data || []) as unknown as PickupRow[]).map((row) => {
    const estimatedWeight = row.estimated_weight || 0;
    const finalWeight = row.total_weight && row.total_weight > 0 ? row.total_weight : undefined;

    return {
      rawId: row.id,
      userId: row.user_id,
      id: `REC-${row.id.slice(0, 5).toUpperCase()}`,
      createdAt: row.created_at,
      customerName: row.user?.full_name || "Tanpa Nama",
      customerPhone: row.user?.phone || "-",
      category: row.kategori?.name || "Kategori",
      pointsPerKg: row.kategori?.points_per_kg || 0,
      estimatedWeight,
      finalWeight,
      points: row.total_points_earned || 0,
      status: row.status,
      address: row.pickup_address || "Alamat belum tersedia",
      notes: row.notes || "",
      courierName: row.kurir?.full_name || undefined,
      courierPhone: row.kurir?.phone || undefined,
    };
  });

  return {
    pickups,
    totalData: count || 0,
  };
}

export function usePickups(currentPage: number, activeStatus: "all" | PickupStatus) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: adminQueryKeys.setoran.list(currentPage, activeStatus),
    queryFn: () => fetchAdminPickups(currentPage, activeStatus),
    staleTime: 30 * 1000,
  });

  const completePickup = async (item: PickupItem, validatedWeight: string) => {
    if (item.status !== "picked_up") {
      alert("Setoran hanya bisa diselesaikan admin saat status sudah picked_up.");
      return false;
    }

    const finalWeightNumber = Number(validatedWeight);
    if (Number.isNaN(finalWeightNumber) || finalWeightNumber <= 0) {
      alert("Berat final harus lebih dari 0.");
      return false;
    }

    const finalPoints = Math.floor(finalWeightNumber * item.pointsPerKg);
    setUpdatingId(item.id);

    const { error: pickupError } = await supabase
      .from("pickups")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        total_weight: finalWeightNumber,
        total_points_earned: finalPoints,
      })
      .eq("id", item.rawId)
      .eq("status", "picked_up");

    if (pickupError) {
      alert("Gagal validasi setoran: " + pickupError.message);
      setUpdatingId(null);
      return false;
    }

    const { data: profileData, error: profileReadError } = await supabase
      .from("profiles")
      .select("total_points")
      .eq("id", item.userId)
      .single();

    if (profileReadError) {
      alert("Setoran selesai, tapi gagal baca poin user: " + profileReadError.message);
      await refetch();
      setUpdatingId(null);
      return false;
    }

    const currentPoints = profileData?.total_points || 0;

    const { error: profileUpdateError } = await supabase
      .from("profiles")
      .update({
        total_points: currentPoints + finalPoints,
        updated_at: new Date().toISOString(),
      })
      .eq("id", item.userId);

    if (profileUpdateError) {
      alert("Status setoran sudah completed, tapi gagal tambah poin user: " + profileUpdateError.message);
      await refetch();
      setUpdatingId(null);
      return false;
    }

    alert(
      `Setoran berhasil diselesaikan.\nBerat final: ${finalWeightNumber} Kg\nPoin ditambahkan: ${finalPoints.toLocaleString("id-ID")} poin`,
    );

    await Promise.all([
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.setoran.all }),
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.dashboard.all }),
    ]);

    setUpdatingId(null);
    return true;
  };

  return {
    pickups: data?.pickups || [],
    totalData: data?.totalData || 0,
    loading: isLoading,
    errorMessage: error instanceof Error ? error.message : null,
    updatingId,
    fetchPickups: refetch,
    completePickup,
  };
}
