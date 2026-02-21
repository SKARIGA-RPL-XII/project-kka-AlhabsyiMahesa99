"use client";

import React from "react";
import { ReportExportActions } from "./components/ReportExportActions";
import { ReportFilterPanel } from "./components/ReportFilterPanel";
import { ReportHeader } from "./components/ReportHeader";
import { ReportMessage } from "./components/ReportMessage";
import { ReportRedemptionsTable } from "./components/ReportRedemptionsTable";
import { ReportSummaryCards } from "./components/ReportSummaryCards";
import { useAdminReport } from "./hooks/useAdminReport";

export default function AdminLaporanPage() {
  const {
    periodType,
    selectedMonth,
    selectedYear,
    loading,
    reportReady,
    summary,
    redemptionsRows,
    paginatedRedemptions,
    currentReportPage,
    totalReportPages,
    message,
    setPeriodType,
    setSelectedMonth,
    setSelectedYear,
    setCurrentReportPage,
    handleGenerateReport,
    handleExportXlsx,
    handleExportPdf,
  } = useAdminReport();

  return (
    <div className="space-y-8 font-poppins text-[#222D33]">
      {/* Header */}
      <ReportHeader
        title="Laporan & Export Data"
        subtitle="Generate laporan bulanan/tahunan dari data transaksi, lalu export untuk kebutuhan pimpinan atau pemerintah."
      />

      {/* Panel Filter */}
      <ReportFilterPanel
        periodType={periodType}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        loading={loading}
        onChangePeriodType={setPeriodType}
        onChangeSelectedMonth={setSelectedMonth}
        onChangeSelectedYear={setSelectedYear}
        onGenerate={handleGenerateReport}
      />

      {/* Message */}
      <ReportMessage message={message} />

      {/* Summary + Export + Log */}
      {reportReady && (
        <>
          <ReportSummaryCards summary={summary} />

          <ReportExportActions onExportXlsx={handleExportXlsx} onExportPdf={handleExportPdf} />

          <ReportRedemptionsTable
            rows={paginatedRedemptions}
            totalRows={redemptionsRows.length}
            currentPage={currentReportPage}
            totalPages={totalReportPages}
            onPrevPage={() => setCurrentReportPage((prev) => prev - 1)}
            onNextPage={() => setCurrentReportPage((prev) => prev + 1)}
          />
        </>
      )}
    </div>
  );
}
