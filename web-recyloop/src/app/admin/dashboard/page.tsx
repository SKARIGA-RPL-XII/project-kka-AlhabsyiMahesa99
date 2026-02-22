"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { DashboardStatsGrid } from "./components/DashboardStatsGrid";
import { QuickActionsCard } from "./components/QuickActionsCard";
import { RecentPickupsCard } from "./components/RecentPickupsCard";
import { useAdminDashboard } from "./hooks/useAdminDashboard";

export default function AdminDashboard() {
  const router = useRouter();
  const { loading, errorMessage, stats, recentPickups, totalWasteTon } = useAdminDashboard();

  return (
    <div className="font-poppins space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#222D33] font-poppins">Admin Overview</h1>
        <p className="text-gray-500">Monitor seluruh aktivitas Recyloop hari ini.</p>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {errorMessage}
        </div>
      )}

      <DashboardStatsGrid loading={loading} stats={stats} totalWasteTon={totalWasteTon} />

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <RecentPickupsCard
          loading={loading}
          rows={recentPickups}
          onSeeAll={() => router.push("/admin/setoran")}
        />

        <QuickActionsCard
          onGoMaster={() => router.push("/admin/master")}
          onGoReward={() => router.push("/admin/reward")}
          onGoUsers={() => router.push("/admin/users")}
          onGoLaporan={() => router.push("/admin/laporan")}
        />
      </div>
    </div>
  );
}
