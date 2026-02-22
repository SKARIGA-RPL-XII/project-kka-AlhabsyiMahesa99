"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { DashboardStats, RecentPickupItem, RecentPickupRow } from "../types/dashboard";

export function useAdminDashboard() {
  // State dashboard agar data tidak dummy
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    pendingPickups: 0,
    totalWasteKg: 0,
    totalPointsSpent: 0,
  });
  const [recentPickups, setRecentPickups] = useState<RecentPickupItem[]>([]);

  // Helper normalisasi relasi supabase (bisa object atau array)
  const pickFirst = <T,>(value: T | T[] | null | undefined): T | null => {
    if (!value) return null;
    return Array.isArray(value) ? (value[0] ?? null) : value;
  };

  // Ambil data dashboard
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const [usersRes, pendingRes, pickupsRes, pointsRes, recentRes] = await Promise.all([
        // Total akun non-admin (warga + kurir)
        supabase.from("profiles").select("id", { count: "exact", head: true }).neq("role", "admin"),
        // Total setoran pending
        supabase.from("pickups").select("id", { count: "exact", head: true }).eq("status", "pending"),
        // Ambil berat total sampah dari semua setoran
        supabase.from("pickups").select("total_weight, estimated_weight"),
        // Ambil total poin yang dipakai user di fitur redeem
        supabase.from("redemptions").select("points_spent"),
        // Setoran terbaru untuk preview list
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

      const totalWasteKg = (pickupsRes.data || []).reduce((acc, item) => {
        return acc + (item.total_weight || item.estimated_weight || 0);
      }, 0);

      const totalPointsSpent = (pointsRes.data || []).reduce((acc, item) => acc + (item.points_spent || 0), 0);

      setStats({
        totalUsers: usersRes.count || 0,
        pendingPickups: pendingRes.count || 0,
        totalWasteKg,
        totalPointsSpent,
      });

      const mappedRecent = ((recentRes.data || []) as RecentPickupRow[]).map((item) => {
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

      setRecentPickups(mappedRecent);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Gagal memuat dashboard.";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Format total sampah dalam ton
  const totalWasteTon = useMemo(() => (stats.totalWasteKg / 1000).toFixed(1), [stats.totalWasteKg]);

  return {
    loading,
    errorMessage,
    stats,
    recentPickups,
    totalWasteTon,
  };
}
