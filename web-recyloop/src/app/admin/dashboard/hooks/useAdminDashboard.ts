"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { adminQueryKeys } from "@/app/admin/queryKeys";
import { DashboardStats, RecentPickupItem, RecentPickupRow } from "../types/dashboard";

type AdminDashboardQueryResult = {
  stats: DashboardStats;
  recentPickups: RecentPickupItem[];
};

const pickFirst = <T,>(value: T | T[] | null | undefined): T | null => {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
};

async function fetchAdminDashboard(): Promise<AdminDashboardQueryResult> {
  const [usersRes, pendingRes, pickupsRes, pointsRes, recentRes] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }).neq("role", "admin"),
    supabase.from("pickups").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("pickups").select("total_weight, estimated_weight"),
    supabase.from("redemptions").select("points_spent"),
    supabase
      .from("pickups")
      .select(
        "id, status, estimated_weight, total_weight, user:profiles!pickups_user_id_fkey(full_name), kategori:waste_categories!pickups_waste_category_id_fkey(name)",
      )
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  if (usersRes.error) throw usersRes.error;
  if (pendingRes.error) throw pendingRes.error;
  if (pickupsRes.error) throw pickupsRes.error;
  if (pointsRes.error) throw pointsRes.error;
  if (recentRes.error) throw recentRes.error;

  const totalWasteKg = (pickupsRes.data || []).reduce((acc, item) => acc + (item.total_weight || item.estimated_weight || 0), 0);
  const totalPointsSpent = (pointsRes.data || []).reduce((acc, item) => acc + (item.points_spent || 0), 0);

  const recentPickups = ((recentRes.data || []) as RecentPickupRow[]).map((item) => {
    const user = pickFirst(item.user);
    const category = pickFirst(item.kategori);
    const weightKg = item.total_weight || item.estimated_weight || 0;

    return {
      id: item.id,
      displayId: `REC-${item.id.slice(0, 5).toUpperCase()}`,
      status: item.status,
      customerName: user?.full_name || "Tanpa Nama",
      categoryName: category?.name || "Kategori",
      weightKg,
    };
  });

  return {
    stats: {
      totalUsers: usersRes.count || 0,
      pendingPickups: pendingRes.count || 0,
      totalWasteKg,
      totalPointsSpent,
    },
    recentPickups,
  };
}

export function useAdminDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: adminQueryKeys.dashboard.detail("overview"),
    queryFn: fetchAdminDashboard,
    staleTime: 60 * 1000,
  });
  const stats = data?.stats || {
    totalUsers: 0,
    pendingPickups: 0,
    totalWasteKg: 0,
    totalPointsSpent: 0,
  };
  const recentPickups = data?.recentPickups || [];

  const totalWasteTon = useMemo(() => (stats.totalWasteKg / 1000).toFixed(1), [stats.totalWasteKg]);

  return {
    loading: isLoading,
    errorMessage: error instanceof Error ? error.message : null,
    stats,
    recentPickups,
    totalWasteTon,
  };
}
