"use client";

import React from "react";
import { useRouter } from "next/navigation";
import DashboardQuickBanner from "./components/DashboardQuickBanner";
import DashboardRecentActivities from "./components/DashboardRecentActivities";
import DashboardStatsGrid from "./components/DashboardStatsGrid";
import { useUserDashboard } from "./hooks/useUserDashboard";

export default function UserDashboard() {
  const router = useRouter();
  const { loading, errorMessage, userName, stats, activities } = useUserDashboard();

  return (
    <div className="space-y-8">
      {/* Header Welcome */}
      <div>
        <h1 className="text-3xl font-bold text-[#222D33] font-poppins">Halo, {userName}!</h1>
        <p className="text-gray-500 font-poppins mt-1">Kelola saldo dan kontribusimu untuk bumi hari ini.</p>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 font-poppins">
          {errorMessage}
        </div>
      )}

      <DashboardStatsGrid stats={stats} />

      <DashboardQuickBanner onGoSetor={() => router.push("/user/setor")} />

      <DashboardRecentActivities loading={loading} rows={activities} onGoRiwayat={() => router.push("/user/riwayat")} />
    </div>
  );
}