"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock, Coins, Recycle } from "lucide-react";
import { DashboardStatItem } from "../types/dashboard";
import { fetchUserDashboard, userDashboardKeys } from "./dashboardQueries";

export function useUserDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: userDashboardKeys.detail("me"),
    queryFn: fetchUserDashboard,
    staleTime: 30 * 1000,
  });

  const stats = useMemo<DashboardStatItem[]>(
    () => [
      {
        title: "Setoran Selesai",
        value: isLoading ? "..." : (data?.completedPickupCount || 0).toLocaleString("id-ID"),
        unit: "Kali",
        icon: CheckCircle2,
        color: "text-blue-600",
        bg: "bg-blue-100",
      },
      {
        title: "Total Poin",
        value: isLoading ? "..." : (data?.totalPoints || 0).toLocaleString("id-ID"),
        unit: "Pts",
        icon: Coins,
        color: "text-purple-600",
        bg: "bg-purple-100",
      },
      {
        title: "Sampah Terkumpul",
        value: isLoading ? "..." : (data?.totalWasteKg || 0).toFixed(1),
        unit: "Kg",
        icon: Recycle,
        color: "text-green-600",
        bg: "bg-green-100",
      },
      {
        title: "Status Jemput",
        value: isLoading ? "..." : (data?.activePickupCount || 0).toLocaleString("id-ID"),
        unit: "Aktif",
        icon: Clock,
        color: "text-orange-600",
        bg: "bg-orange-100",
      },
    ],
    [data, isLoading],
  );

  return {
    loading: isLoading,
    errorMessage: error instanceof Error ? error.message : null,
    userName: data?.userName || "Users",
    stats,
    activities: data?.activities || [],
  };
}
