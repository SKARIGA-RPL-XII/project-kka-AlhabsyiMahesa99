"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AddRewardCategoryModal } from "./components/AddRewardCategoryModal";
import { RewardAuditStats } from "./components/RewardAuditStats";
import { RewardCatalog } from "./components/RewardCatalog";
import { RewardHeader } from "./components/RewardHeader";
import { RewardTransactionTable } from "./components/RewardTransactionTable";
import { EditRewardModal } from "./components/EditRewardModal";
import { useRewardAdmin } from "./hooks/useRewardAdmin";

export default function RewardManagementPage() {
  const router = useRouter();
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const {
    redemptions,
    loadingRewards,
    loadingRedemptions,
    currentPage,
    setCurrentPage,
    totalPages,
    monthlyAudit,
    message,
    editingReward,
    editStock,
    setEditStock,
    editPoints,
    setEditPoints,
    catalogRewards,
    setEditingReward,
    openEditModal,
    handleSaveEdit,
    handleToggleRewardActive,
  } = useRewardAdmin();

  // Helper format Rupiah
  const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);

  // Helper format waktu log transaksi
  const formatDateTime = (value: string) => {
    const date = new Date(value);
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-8 font-poppins text-[#222D33]">
      {/* Header */}
      <RewardHeader
        title="Manajemen Reward"
        subtitle="Kelola katalog reward agar terasa nyata: kategori jelas, partner jelas, dan detail klaim jelas."
        onAddCategory={() => setShowAddCategoryModal(true)}
        onAddReward={() => router.push("/admin/reward/tambah")}
      />

      {/* Alert Message */}
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

      {/* Ringkasan Audit */}
      <RewardAuditStats monthlyAudit={monthlyAudit} formatRupiah={formatRupiah} />

      {/* Katalog */}
      <RewardCatalog
        loading={loadingRewards}
        rewards={catalogRewards}
        formatRupiah={formatRupiah}
        onEditStock={openEditModal}
        onToggleActive={handleToggleRewardActive}
      />

      {/* Log transaksi */}
      <RewardTransactionTable
        loading={loadingRedemptions}
        rows={redemptions}
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevPage={() => setCurrentPage((prev) => prev - 1)}
        onNextPage={() => setCurrentPage((prev) => prev + 1)}
        formatRupiah={formatRupiah}
        formatDateTime={formatDateTime}
      />

      {/* Modal Edit Stock */}
      <EditRewardModal
        reward={editingReward}
        editStock={editStock}
        editPoints={editPoints}
        onChangeStock={setEditStock}
        onChangePoints={setEditPoints}
        onCancel={() => setEditingReward(null)}
        onSave={handleSaveEdit}
      />

      <AddRewardCategoryModal open={showAddCategoryModal} onClose={() => setShowAddCategoryModal(false)} />
    </div>
  );
}
