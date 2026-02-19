"use client";

import React from "react";
import { RewardCategoryFilter } from "./components/RewardCategoryFilter";
import { RewardCatalogGrid } from "./components/RewardCatalogGrid";
import { RewardHistoryTable } from "./components/RewardHistoryTable";
import { RewardPageHeader } from "./components/RewardPageHeader";
import { RewardSummaryCards } from "./components/RewardSummaryCards";
import { RedemptionDetailModal } from "./components/RedemptionDetailModal";
import { useUserRewards } from "./hooks/useUserRewards";

export default function UserRewardPage() {
  const {
    profile,
    filteredRewards,
    categories,
    history,
    totalRedeemedAmount,
    selectedHistory,
    loading,
    historyLoading,
    processingRewardId,
    message,
    activeCategory,
    expandedRewardId,
    historyPage,
    totalHistoryPages,
    formatRupiah,
    formatDateTime,
    pickFirstRelation,
    setActiveCategory,
    setExpandedRewardId,
    setSelectedHistory,
    setHistoryPage,
    handleRedeem,
  } = useUserRewards();

  return (
    <div className="space-y-8 font-poppins text-[#222D33]">
      {/* Header */}
      <RewardPageHeader />

      {/* Summary poin user */}
      <RewardSummaryCards
        profile={profile}
        totalRedeemedAmount={totalRedeemedAmount}
        formatRupiah={formatRupiah}
      />

      {/* Feedback Message */}
      {message && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm font-medium ${
            message.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Filter kategori */}
      <RewardCategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onChangeCategory={setActiveCategory}
      />

      {/* Grid reward aktif */}
      <RewardCatalogGrid
        loading={loading}
        rewards={filteredRewards}
        profilePoints={profile?.total_points || 0}
        processingRewardId={processingRewardId}
        expandedRewardId={expandedRewardId}
        onToggleDetail={(rewardId) =>
          setExpandedRewardId((prev) => (prev === rewardId ? null : rewardId))
        }
        onRedeem={handleRedeem}
        formatRupiah={formatRupiah}
      />

      {/* Riwayat redeem user + pagination */}
      <RewardHistoryTable
        loading={historyLoading}
        rows={history}
        historyPage={historyPage}
        totalHistoryPages={totalHistoryPages}
        formatRupiah={formatRupiah}
        formatDateTime={formatDateTime}
        pickFirstRelation={pickFirstRelation}
        onOpenDetail={setSelectedHistory}
        onPrevPage={() => setHistoryPage((prev) => prev - 1)}
        onNextPage={() => setHistoryPage((prev) => prev + 1)}
      />

      {/* Modal detail redemption */}
      <RedemptionDetailModal
        selectedHistory={selectedHistory}
        pickFirstRelation={pickFirstRelation}
        onClose={() => setSelectedHistory(null)}
      />
    </div>
  );
}