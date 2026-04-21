"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { CheckCircle, Package, Scale, Truck } from "lucide-react";
import { kurirQueryKeys } from "@/app/kurir/queryKeys";

type DashboardStatsData = {
  available: number;
  onGoing: number;
  completedToday: number;
  totalWeight: number;
};

async function fetchCourierDashboard(): Promise<DashboardStatsData> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      available: 0,
      onGoing: 0,
      completedToday: 0,
      totalWeight: 0,
    };
  }

  const { count: availableCount } = await supabase
    .from("pickups")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  const { count: onGoingCount } = await supabase
    .from("pickups")
    .select("*", { count: "exact", head: true })
    .eq("kurir_id", user.id)
    .eq("status", "scheduled");

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

  const { data: finishedData, error } = await supabase
    .from("pickups")
    .select("total_weight")
    .eq("kurir_id", user.id)
    .in("status", ["picked_up", "completed"])
    .gte("created_at", startOfToday);

  if (error) {
    console.error("Error dashboard:", error);
  }

  const totalWeight = finishedData?.reduce((acc, curr) => acc + (curr.total_weight || 0), 0) || 0;

  return {
    available: availableCount || 0,
    onGoing: onGoingCount || 0,
    completedToday: finishedData?.length || 0,
    totalWeight,
  };
}

export function useCourierDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: kurirQueryKeys.dashboard.detail("me"),
    queryFn: fetchCourierDashboard,
    staleTime: 30 * 1000,
  });
  const statsData = data || {
    available: 0,
    onGoing: 0,
    completedToday: 0,
    totalWeight: 0,
  };

  const stats = useMemo(
    () => [
      {
        label: "Tugas Tersedia",
        value: statsData.available.toString(),
        icon: Package,
        color: "bg-blue-100 text-blue-600",
      },
      {
        label: "Sedang Dijemput",
        value: statsData.onGoing.toString(),
        icon: Truck,
        color: "bg-yellow-100 text-yellow-600",
      },
      {
        label: "Selesai Hari Ini",
        value: statsData.completedToday.toString(),
        icon: CheckCircle,
        color: "bg-green-100 text-green-600",
      },
      {
        label: "Total Berat (Kg)",
        value: statsData.totalWeight.toFixed(1),
        icon: Scale,
        color: "bg-purple-100 text-purple-600",
      },
    ],
    [statsData],
  );

  return { loading: isLoading, stats };
}
