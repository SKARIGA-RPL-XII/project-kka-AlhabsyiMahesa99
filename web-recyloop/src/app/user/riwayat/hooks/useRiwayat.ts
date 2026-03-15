"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { PickupRow, StatusFilter } from "../types/riwayat";
import { formatPickupId, pickFirst, statusLabel } from "../utils/riwayatFormat";

export const ITEMS_PER_PAGE = 5;

export function useRiwayat() {
  // State utama halaman riwayat
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rows, setRows] = useState<PickupRow[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [allData, setAllData] = useState<PickupRow[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeStatus, setActiveStatus] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [selectedDetail, setSelectedDetail] = useState<PickupRow | null>(null);

  const totalPages = Math.max(1, Math.ceil(totalData / ITEMS_PER_PAGE));

  // Query data riwayat user sesuai filter + pagination
  const fetchRiwayat = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) {
        setRows([]);
        setAllData([]);
        setTotalData(0);
        setLoading(false);
        return;
      }

      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      let query = supabase
        .from("pickups")
        .select(
          `
            id,
            created_at,
            status,
            estimated_weight,
            total_weight,
            total_points_earned,
            pickup_address,
            notes,
            completed_at,
            waste_category:waste_categories!pickups_waste_category_id_fkey(name),
            courier:profiles!pickups_kurir_id_fkey(full_name, phone)
          `,
          { count: "exact" },
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (activeStatus !== "all") {
        query = query.eq("status", activeStatus);
      }

      const { data, error, count } = await query;
      if (error) throw error;

      setRows((data as PickupRow[]) || []);
      setTotalData(count || 0);

      // Fetch semua data untuk summary cards (tetap full, bukan per halaman)
      let summaryQuery = supabase
        .from("pickups")
        .select(
          `
            id,
            created_at,
            status,
            estimated_weight,
            total_weight,
            total_points_earned,
            pickup_address,
            notes,
            completed_at,
            waste_category:waste_categories!pickups_waste_category_id_fkey(name),
            courier:profiles!pickups_kurir_id_fkey(full_name, phone)
          `,
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (activeStatus !== "all") {
        summaryQuery = summaryQuery.eq("status", activeStatus);
      }

      const { data: summaryData, error: summaryError } = await summaryQuery;
      if (summaryError) throw summaryError;

      setAllData((summaryData as PickupRow[]) || []);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Gagal memuat riwayat setoran.";
      setErrorMessage(message);
      setRows([]);
      setAllData([]);
      setTotalData(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiwayat();
  }, [currentPage, activeStatus]);

  // Search client-side untuk ID/alamat/kategori/status pada data halaman aktif
  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows;
    const keyword = search.toLowerCase().trim();

    return rows.filter((item) => {
      const category = pickFirst(item.waste_category);
      const idText = formatPickupId(item.id).toLowerCase();
      const address = (item.pickup_address || "").toLowerCase();
      const categoryText = (category?.name || "").toLowerCase();
      const statusText = statusLabel(item.status).toLowerCase();

      return (
        idText.includes(keyword) ||
        address.includes(keyword) ||
        categoryText.includes(keyword) ||
        statusText.includes(keyword)
      );
    });
  }, [rows, search]);

  // Summary cards
  const summary = useMemo(() => {
    const total = allData.length;
    const inProgress = allData.filter((item) => ["pending", "scheduled", "picked_up"].includes(item.status)).length;
    const done = allData.filter((item) => item.status === "completed").length;
    return { total, inProgress, done };
  }, [allData]);

  const statusTabs: { id: StatusFilter; label: string }[] = [
    { id: "all", label: "Semua" },
    { id: "pending", label: "Pending" },
    { id: "scheduled", label: "Kurir Menuju Lokasi" },
    { id: "picked_up", label: "Proses Timbang" },
    { id: "completed", label: "Selesai" },
  ];

  return {
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
  };
}
