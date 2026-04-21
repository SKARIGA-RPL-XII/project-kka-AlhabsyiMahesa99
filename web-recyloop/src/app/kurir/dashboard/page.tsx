"use client";

import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { CourierDashboardAction } from "./components/DashboardAction";
import { CourierDashboardHeader } from "./components/DashboardHeader";
import { CourierDashboardStats } from "./components/DashboardStats";
import { useCourierDashboard } from "./hooks/useCourierDashboard";

export default function CourierDashboard() {
  const router = useRouter();
  const { loading, stats } = useCourierDashboard();

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 font-poppins">
      <CourierDashboardHeader />
      <CourierDashboardStats stats={stats} />
      <CourierDashboardAction onStart={() => router.push("/kurir/daftar-pickup")} />
    </div>
  );
}
