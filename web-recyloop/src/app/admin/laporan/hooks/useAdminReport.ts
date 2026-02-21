"use client";

import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { supabase } from "@/lib/supabase";
import { MONTH_OPTIONS, REPORT_ITEMS_PER_PAGE } from "../constants/report";
import { formatDateTime, pickFirstRelation } from "../utils/reportFormat";
import { PeriodType, ReportMessage, ReportPickupRow, ReportRedemptionRow, ReportSummary } from "../types/report";

export function useAdminReport() {
  const now = new Date();

  // State filter periode laporan
  const [periodType, setPeriodType] = useState<PeriodType>("monthly");
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  // State data laporan
  const [loading, setLoading] = useState(false);
  const [reportReady, setReportReady] = useState(false);
  const [summary, setSummary] = useState<ReportSummary>({
    totalPickups: 0,
    completedPickups: 0,
    totalWeight: 0,
    totalPointsEarned: 0,
    totalRedemptions: 0,
    totalPointsSpent: 0,
    totalAmountAdded: 0,
  });
  const [redemptionsRows, setRedemptionsRows] = useState<ReportRedemptionRow[]>([]);
  const [currentReportPage, setCurrentReportPage] = useState(1);
  const [message, setMessage] = useState<ReportMessage>(null);

  // Hitung range tanggal berdasarkan periode terpilih
  const periodRange = useMemo(() => {
    let startDate: Date;
    let endDate: Date;

    if (periodType === "monthly") {
      startDate = new Date(selectedYear, selectedMonth - 1, 1, 0, 0, 0);
      endDate = new Date(selectedYear, selectedMonth, 0, 23, 59, 59);
    } else {
      startDate = new Date(selectedYear, 0, 1, 0, 0, 0);
      endDate = new Date(selectedYear, 11, 31, 23, 59, 59);
    }

    return {
      startIso: startDate.toISOString(),
      endIso: endDate.toISOString(),
      label:
        periodType === "monthly"
          ? `${MONTH_OPTIONS[selectedMonth - 1]} ${selectedYear}`
          : `Tahun ${selectedYear}`,
    };
  }, [periodType, selectedMonth, selectedYear]);

  // Data tabel redemptions per halaman (maksimal 5 baris)
  const paginatedRedemptions = useMemo(() => {
    const start = (currentReportPage - 1) * REPORT_ITEMS_PER_PAGE;
    const end = start + REPORT_ITEMS_PER_PAGE;
    return redemptionsRows.slice(start, end);
  }, [currentReportPage, redemptionsRows]);

  // Hitung total halaman pagination
  const totalReportPages = Math.max(1, Math.ceil(redemptionsRows.length / REPORT_ITEMS_PER_PAGE));

  // Jaga halaman aktif tetap valid saat jumlah data berubah
  useEffect(() => {
    if (currentReportPage > totalReportPages) {
      setCurrentReportPage(totalReportPages);
    }
  }, [currentReportPage, totalReportPages]);

  // Generate laporan berdasarkan periode
  const handleGenerateReport = async () => {
    setLoading(true);
    setMessage(null);

    try {
      // 1) Ambil pickups pada periode terpilih
      const { data: pickupsData, error: pickupsError } = await supabase
        .from("pickups")
        .select(
          "id, created_at, status, total_weight, total_points_earned, estimated_weight, profiles:profiles!pickups_user_id_fkey(full_name, email)",
        )
        .gte("created_at", periodRange.startIso)
        .lte("created_at", periodRange.endIso)
        .order("created_at", { ascending: false });

      if (pickupsError) throw pickupsError;

      // 2) Ambil redemptions pada periode terpilih
      const { data: redemptionsData, error: redemptionsError } = await supabase
        .from("redemptions")
        .select(
          "id, created_at, points_spent, amount_added, status, fulfillment_status, profiles:profiles!redemptions_user_id_fkey(full_name, email), rewards:rewards!redemptions_reward_id_fkey(title, reward_category)",
        )
        .gte("created_at", periodRange.startIso)
        .lte("created_at", periodRange.endIso)
        .order("created_at", { ascending: false });

      if (redemptionsError) throw redemptionsError;

      const typedPickups = (pickupsData as ReportPickupRow[]) || [];
      const typedRedemptions = (redemptionsData as ReportRedemptionRow[]) || [];

      // 3) Hitung summary laporan
      const completedPickups = typedPickups.filter((item) => item.status === "completed").length;
      const totalWeight = typedPickups.reduce(
        (acc, item) => acc + (item.total_weight || item.estimated_weight || 0),
        0,
      );
      const totalPointsEarned = typedPickups.reduce(
        (acc, item) => acc + (item.total_points_earned || 0),
        0,
      );
      const totalPointsSpent = typedRedemptions.reduce((acc, item) => acc + (item.points_spent || 0), 0);
      const totalAmountAdded = typedRedemptions.reduce((acc, item) => acc + (item.amount_added || 0), 0);

      setSummary({
        totalPickups: typedPickups.length,
        completedPickups,
        totalWeight,
        totalPointsEarned,
        totalRedemptions: typedRedemptions.length,
        totalPointsSpent,
        totalAmountAdded,
      });
      setRedemptionsRows(typedRedemptions);
      setCurrentReportPage(1);
      setReportReady(true);
      setMessage({ type: "success", text: `Laporan periode ${periodRange.label} berhasil digenerate.` });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Gagal generate laporan.";
      setMessage({ type: "error", text: errorMessage });
      setReportReady(false);
    } finally {
      setLoading(false);
    }
  };

  // Export XLSX (Excel native)
  const handleExportXlsx = () => {
    if (!reportReady) return;

    const summaryRows = [
      { metrik: "Periode", nilai: periodRange.label },
      { metrik: "Total Pickups", nilai: summary.totalPickups },
      { metrik: "Pickups Selesai", nilai: summary.completedPickups },
      { metrik: "Total Berat (Kg)", nilai: Number(summary.totalWeight.toFixed(2)) },
      { metrik: "Total Poin Earned", nilai: summary.totalPointsEarned },
      { metrik: "Total Redemptions", nilai: summary.totalRedemptions },
      { metrik: "Total Poin Spent", nilai: summary.totalPointsSpent },
      { metrik: "Total Nominal Keluar", nilai: summary.totalAmountAdded },
    ];

    const redemptionRows = redemptionsRows.map((item) => {
      const profile = pickFirstRelation(item.profiles);
      const reward = pickFirstRelation(item.rewards);

      return {
        tanggal: formatDateTime(item.created_at),
        user: profile?.full_name || "User",
        email: profile?.email || "-",
        reward: reward?.title || "Reward",
        kategori: reward?.reward_category || "-",
        poin_spent: item.points_spent,
        nominal: item.amount_added,
        status: item.fulfillment_status || item.status || "-",
      };
    });

    const wb = XLSX.utils.book_new();
    const summarySheet = XLSX.utils.json_to_sheet(summaryRows);
    const redemptionsSheet = XLSX.utils.json_to_sheet(redemptionRows);

    XLSX.utils.book_append_sheet(wb, summarySheet, "Ringkasan");
    XLSX.utils.book_append_sheet(wb, redemptionsSheet, "Log Redemptions");

    XLSX.writeFile(
      wb,
      `laporan-${periodType}-${selectedYear}-${String(selectedMonth).padStart(2, "0")}.xlsx`,
    );
  };

  // Export PDF sederhana via print preview
  const handleExportPdf = () => {
    if (!reportReady) return;

    const popup = window.open("", "_blank", "width=900,height=700");
    if (!popup) return;

    const summaryHtml = `
      <h2>Ringkasan</h2>
      <ul>
        <li>Total Pickups: ${summary.totalPickups}</li>
        <li>Pickups Selesai: ${summary.completedPickups}</li>
        <li>Total Berat: ${summary.totalWeight.toFixed(2)} Kg</li>
        <li>Total Poin Earned: ${summary.totalPointsEarned}</li>
        <li>Total Redemptions: ${summary.totalRedemptions}</li>
        <li>Total Poin Spent: ${summary.totalPointsSpent}</li>
        <li>Total Nominal Keluar: ${summary.totalAmountAdded.toLocaleString("id-ID")}</li>
      </ul>
    `;

    const rowsHtml = redemptionsRows
      .map((item) => {
        const profile = pickFirstRelation(item.profiles);
        const reward = pickFirstRelation(item.rewards);
        return `
          <tr>
            <td>${formatDateTime(item.created_at)}</td>
            <td>${profile?.full_name || "User"}</td>
            <td>${reward?.title || "Reward"}</td>
            <td>${reward?.reward_category || "-"}</td>
            <td>${item.points_spent}</td>
            <td>${item.amount_added.toLocaleString("id-ID")}</td>
            <td>${item.fulfillment_status || item.status || "-"}</td>
          </tr>
        `;
      })
      .join("");

    popup.document.write(`
      <html>
        <head>
          <title>Laporan ${periodRange.label}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; }
            th, td { border: 1px solid #ddd; padding: 8px; font-size: 12px; }
            th { background: #f4f4f4; text-align: left; }
          </style>
        </head>
        <body>
          <h1>Laporan Recyloop</h1>
          <p>Periode: ${periodRange.label}</p>
          ${summaryHtml}
          <h2>Log Redemptions</h2>
          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>User</th>
                <th>Reward</th>
                <th>Kategori</th>
                <th>Poin Spent</th>
                <th>Nominal</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </body>
      </html>
    `);

    popup.document.close();
    popup.focus();
    popup.print();
  };

  return {
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
    periodRange,
    message,
    setPeriodType,
    setSelectedMonth,
    setSelectedYear,
    setCurrentReportPage,
    handleGenerateReport,
    handleExportXlsx,
    handleExportPdf,
  };
}
