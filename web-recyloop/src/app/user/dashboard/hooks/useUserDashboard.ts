"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock, Coins, Recycle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { DashboardActivityItem, DashboardStatItem, PickupActivityRow } from "../types/dashboard";

export function useUserDashboard() {
  // State data dashboard user
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userName, setUserName] = useState("Users");
  const [totalPoints, setTotalPoints] = useState(0);
  const [completedPickupCount, setCompletedPickupCount] = useState(0);
  const [totalWasteKg, setTotalWasteKg] = useState(0);
  const [activePickupCount, setActivePickupCount] = useState(0);
  const [activities, setActivities] = useState<PickupActivityRow[]>([]);

  // Helper relasi Supabase (kadang object, kadang array)
  const pickFirst = <T,>(value: T | T[] | null | undefined): T | null => {
    if (!value) return null;
    return Array.isArray(value) ? (value[0] ?? null) : value;
  };

  // Helper format waktu aktivitas
  const formatDateTime = (value: string) => {
    return new Date(value).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Helper label status supaya lebih user-friendly
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

  // Fetch dashboard data dari database (tanpa dummy)
  const fetchDashboardData = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) {
        setLoading(false);
        return;
      }

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

      const wasteSum = pickupRows.reduce((acc, item) => acc + (item.total_weight || item.estimated_weight || 0), 0);
      const activeCount = pickupRows.filter((item) => ["pending", "scheduled", "picked_up"].includes(item.status || "")).length;
      const completedCount = pickupRows.filter((item) => item.status === "completed").length;

      setUserName(profileRes.data?.full_name || "Users");
      setTotalPoints(profileRes.data?.total_points || 0);
      setTotalWasteKg(wasteSum);
      setActivePickupCount(activeCount);
      setCompletedPickupCount(completedCount);
      setActivities(pickupRows.slice(0, 3));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Gagal memuat dashboard.";
      setErrorMessage(message);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = useMemo<DashboardStatItem[]>(
    () => [
      {
        title: "Setoran Selesai",
        value: loading ? "..." : completedPickupCount.toLocaleString("id-ID"),
        unit: "Kali",
        icon: CheckCircle2,
        color: "text-blue-600",
        bg: "bg-blue-100",
      },
      {
        title: "Total Poin",
        value: loading ? "..." : totalPoints.toLocaleString("id-ID"),
        unit: "Pts",
        icon: Coins,
        color: "text-purple-600",
        bg: "bg-purple-100",
      },
      {
        title: "Sampah Terkumpul",
        value: loading ? "..." : totalWasteKg.toFixed(1),
        unit: "Kg",
        icon: Recycle,
        color: "text-green-600",
        bg: "bg-green-100",
      },
      {
        title: "Status Jemput",
        value: loading ? "..." : activePickupCount.toLocaleString("id-ID"),
        unit: "Aktif",
        icon: Clock,
        color: "text-orange-600",
        bg: "bg-orange-100",
      },
    ],
    [activePickupCount, completedPickupCount, loading, totalPoints, totalWasteKg],
  );

  const mappedActivities = useMemo<DashboardActivityItem[]>(
    () =>
      activities.map((item) => {
        const category = pickFirst(item.waste_category);

        return {
          id: item.id,
          title: `Setor Sampah ${category?.name || "Kategori"}`,
          time: formatDateTime(item.created_at),
          pointsText: `+${(item.total_points_earned || 0).toLocaleString("id-ID")} Pts`,
          statusText: statusLabel(item.status),
          statusClass: statusClass(item.status),
        };
      }),
    [activities],
  );

  return {
    loading,
    errorMessage,
    userName,
    stats,
    activities: mappedActivities,
  };
}
