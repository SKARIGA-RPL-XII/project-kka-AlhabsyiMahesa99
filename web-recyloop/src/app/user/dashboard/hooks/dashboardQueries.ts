"use client";

import { supabase } from "@/lib/supabase";
import { userQueryKeys } from "@/app/user/queryKeys";
import { DashboardActivityItem, PickupActivityRow } from "../types/dashboard";

export type UserDashboardQueryResult = {
  userName: string;
  totalPoints: number;
  completedPickupCount: number;
  totalWasteKg: number;
  activePickupCount: number;
  activities: DashboardActivityItem[];
};

export const userDashboardKeys = userQueryKeys.dashboard;

const pickFirst = <T,>(value: T | T[] | null | undefined): T | null => {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
};

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const statusLabel = (status: string | null) => {
  if (status === "pending") return "Pending";
  if (status === "scheduled") return "Kurir Menuju Lokasi";
  if (status === "picked_up") return "Proses Timbang";
  if (status === "completed") return "Selesai";
  if (status === "cancelled") return "Dibatalkan";
  return "-";
};

const statusClass = (status: string | null) => {
  if (status === "completed") return "bg-green-100 text-green-700";
  if (status === "picked_up") return "bg-purple-100 text-purple-700";
  if (status === "scheduled") return "bg-blue-100 text-blue-700";
  if (status === "pending") return "bg-orange-100 text-orange-700";
  if (status === "cancelled") return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-700";
};

export async function fetchUserDashboard(): Promise<UserDashboardQueryResult> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("User tidak ditemukan.");

  const [profileRes, pickupsRes] = await Promise.all([
    supabase.from("profiles").select("full_name, total_points").eq("id", user.id).single(),
    supabase
      .from("pickups")
      .select(
        `
          id,
          created_at,
          status,
          total_points_earned,
          total_weight,
          estimated_weight,
          waste_category:waste_categories!pickups_waste_category_id_fkey(name)
        `,
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  if (profileRes.error) throw profileRes.error;
  if (pickupsRes.error) throw pickupsRes.error;

  const pickupRows = (pickupsRes.data as PickupActivityRow[]) || [];
  const totalWasteKg = pickupRows.reduce((acc, item) => acc + (item.total_weight || item.estimated_weight || 0), 0);
  const activePickupCount = pickupRows.filter((item) => ["pending", "scheduled", "picked_up"].includes(item.status || "")).length;
  const completedPickupCount = pickupRows.filter((item) => item.status === "completed").length;

  const activities = pickupRows.slice(0, 3).map((item) => {
    const category = pickFirst(item.waste_category);

    return {
      id: item.id,
      title: `Setor Sampah ${category?.name || "Kategori"}`,
      time: formatDateTime(item.created_at),
      pointsText: `+${(item.total_points_earned || 0).toLocaleString("id-ID")} Pts`,
      statusText: statusLabel(item.status),
      statusClass: statusClass(item.status),
    };
  });

  return {
    userName: profileRes.data?.full_name || "Users",
    totalPoints: profileRes.data?.total_points || 0,
    completedPickupCount,
    totalWasteKg,
    activePickupCount,
    activities,
  };
}
