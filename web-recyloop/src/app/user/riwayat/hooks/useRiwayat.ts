"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PickupRow, StatusFilter } from "../types/riwayat";
import { formatPickupId, pickFirst, statusLabel } from "../utils/riwayatFormat";
import { fetchUserRiwayat, ITEMS_PER_PAGE, userRiwayatKeys } from "./riwayatQueries";

export function useRiwayat() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeStatus, setActiveStatus] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [selectedDetail, setSelectedDetail] = useState<PickupRow | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: userRiwayatKeys.list({ currentPage, activeStatus }),
    queryFn: () => fetchUserRiwayat({ currentPage, activeStatus }),
    staleTime: 30 * 1000,
  });

  const rows = useMemo(() => data?.rows || [], [data?.rows]);
  const totalData = data?.totalData || 0;
  const totalPages = Math.max(1, Math.ceil(totalData / ITEMS_PER_PAGE));

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

  const statusTabs: { id: StatusFilter; label: string }[] = [
    { id: "all", label: "Semua" },
    { id: "pending", label: "Pending" },
    { id: "scheduled", label: "Kurir Menuju Lokasi" },
    { id: "picked_up", label: "Proses Timbang" },
    { id: "completed", label: "Selesai" },
  ];

  return {
    loading: isLoading,
    errorMessage: error instanceof Error ? error.message : null,
    filteredRows,
    summary: data?.summary || { total: 0, inProgress: 0, done: 0 },
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
