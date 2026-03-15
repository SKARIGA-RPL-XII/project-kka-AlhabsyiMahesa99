"use client";

import React from "react";
import { RiwayatDetailModal } from "./components/RiwayatDetailModal";
import { RiwayatFilters } from "./components/RiwayatFilters";
import { RiwayatHeader } from "./components/RiwayatHeader";
import { RiwayatSummaryCards } from "./components/RiwayatSummaryCards";
import { RiwayatTable } from "./components/RiwayatTable";
import { useRiwayat } from "./hooks/useRiwayat";

export default function UserRiwayatPage() {
  const {
    loading,
    errorMessage,
    filteredRows,
    summary,
    statusTabs,
    totalPages,
    currentPage,
    activeStatus,
    search,
    selectedDetail,
    setCurrentPage,
    setActiveStatus,
    setSearch,
    setSelectedDetail,
  } = useRiwayat();

  return (
    <div className="space-y-8 font-poppins text-[#222D33]">
      <RiwayatHeader />

      <RiwayatSummaryCards summary={summary} />

      {/* Error Message */}
      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {errorMessage}
        </div>
      )}

      <RiwayatFilters
        activeStatus={activeStatus}
        search={search}
        statusTabs={statusTabs}
        onChangeStatus={(status) => {
          setActiveStatus(status);
          setCurrentPage(1);
        }}
        onChangeSearch={setSearch}
      />

      <RiwayatTable
        loading={loading}
        rows={filteredRows}
        currentPage={currentPage}
        totalPages={totalPages}
        onOpenDetail={setSelectedDetail}
        onPrevPage={() => setCurrentPage((prev) => prev - 1)}
        onNextPage={() => setCurrentPage((prev) => prev + 1)}
      />

      <RiwayatDetailModal selectedDetail={selectedDetail} onClose={() => setSelectedDetail(null)} />
    </div>
  );
}
