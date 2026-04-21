"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { kurirQueryKeys } from "@/app/kurir/queryKeys";

export type HistoryStatus = "picked_up" | "completed";
export type StatusFilter = "all" | HistoryStatus;

export type HistoryRow = {
  id: string;
  created_at: string;
  status: HistoryStatus;
  estimated_weight: number | null;
  total_weight: number | null;
  total_points_earned: number | null;
  pickup_address: string | null;
  notes: string | null;
  pickup_image_url: string | null;
  completed_at: string | null;
  user: { full_name: string | null; phone: string | null } | { full_name: string | null; phone: string | null }[] | null;
};

type Summary = {
  total: number;
  picked: number;
  done: number;
};

export const ITEMS_PER_PAGE = 5;
export const STATUS_TABS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "Semua" },
  { id: "picked_up", label: "Proses Kirim" },
  { id: "completed", label: "Selesai" },
];

function buildMatchedStatus(keyword: string): HistoryStatus[] {
  const normalized = keyword.trim().toLowerCase();
  const mappings: { value: HistoryStatus; aliases: string[] }[] = [
    { value: "picked_up", aliases: ["picked_up", "picked up", "proses timbang", "timbang", "proses"] },
    { value: "completed", aliases: ["completed", "selesai", "done"] },
  ];

  return mappings
    .filter(({ aliases }) => aliases.some((alias) => alias.includes(normalized) || normalized.includes(alias)))
    .map(({ value }) => value);
}

async function getCourierId() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  return user?.id ?? null;
}

async function fetchCourierHistorySummary(): Promise<Summary> {
  const courierId = await getCourierId();
  if (!courierId) return { total: 0, picked: 0, done: 0 };

  const { data, error } = await supabase
    .from("pickups")
    .select("status")
    .eq("kurir_id", courierId)
    .in("status", ["picked_up", "completed"]);

  if (error) throw error;

  const allRows = (data || []) as { status: HistoryStatus }[];
  return {
    total: allRows.length,
    picked: allRows.filter((item) => item.status === "picked_up").length,
    done: allRows.filter((item) => item.status === "completed").length,
  };
}

type HistoryListResult = {
  rows: HistoryRow[];
  totalData: number;
};

async function fetchCourierHistoryList(params: {
  page: number;
  status: StatusFilter;
  search: string;
}): Promise<HistoryListResult> {
  const courierId = await getCourierId();
  if (!courierId) return { rows: [], totalData: 0 };

  const keyword = params.search.trim();
  const matchedStatuses = keyword ? buildMatchedStatus(keyword) : [];
  const parsedWeight = Number(keyword.replace(",", "."));
  const isWeightSearch = keyword !== "" && Number.isFinite(parsedWeight);

  let matchedUserIds: string[] = [];
  if (keyword) {
    const { data: users, error: usersError } = await supabase
      .from("profiles")
      .select("id")
      .ilike("full_name", `%${keyword}%`)
      .limit(50);

    if (usersError) throw usersError;
    matchedUserIds = (users || []).map((item) => item.id);
  }

  const from = (params.page - 1) * ITEMS_PER_PAGE;
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
        pickup_image_url,
        completed_at,
        user:profiles!pickups_user_id_fkey(full_name, phone)
      `,
      { count: "exact" },
    )
    .eq("kurir_id", courierId)
    .in("status", ["picked_up", "completed"])
    .order("created_at", { ascending: false });

  if (params.status !== "all") {
    query = query.eq("status", params.status);
  }

  if (keyword) {
    const searchClauses: string[] = [];

    if (matchedUserIds.length > 0) {
      searchClauses.push(`user_id.in.(${matchedUserIds.join(",")})`);
    }

    if (isWeightSearch) {
      searchClauses.push(`total_weight.eq.${parsedWeight}`);
      searchClauses.push(`estimated_weight.eq.${parsedWeight}`);
    }

    matchedStatuses.forEach((matchedStatus) => {
      searchClauses.push(`status.eq.${matchedStatus}`);
    });

    if (searchClauses.length === 0) {
      return { rows: [], totalData: 0 };
    }

    query = query.or(searchClauses.join(","));
  }

  const { data, error, count } = await query.range(from, to);
  if (error) throw error;

  return {
    rows: ((data as HistoryRow[]) || []).filter((item): item is HistoryRow => Boolean(item)),
    totalData: count || 0,
  };
}

export function useCourierHistory() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [selectedDetail, setSelectedDetail] = useState<HistoryRow | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string | null>(null);

  const summaryQuery = useQuery({
    queryKey: kurirQueryKeys.riwayat.summary("me"),
    queryFn: fetchCourierHistorySummary,
    staleTime: 30 * 1000,
  });

  const listQuery = useQuery({
    queryKey: kurirQueryKeys.riwayat.list(page, status, search.trim()),
    queryFn: () => fetchCourierHistoryList({ page, status, search }),
    staleTime: 30 * 1000,
  });

  const totalData = listQuery.data?.totalData || 0;
  const totalPages = Math.max(1, Math.ceil(totalData / ITEMS_PER_PAGE));

  const tableCaption = useMemo(() => {
    if (totalData === 0) return "Belum ada riwayat jemputan yang sesuai filter.";

    const from = (page - 1) * ITEMS_PER_PAGE + 1;
    const to = Math.min(page * ITEMS_PER_PAGE, totalData);
    return `Menampilkan ${from}-${to} dari ${totalData} riwayat jemputan.`;
  }, [page, totalData]);

  return {
    loading: listQuery.isLoading,
    summaryLoading: summaryQuery.isLoading,
    errorMessage: listQuery.error instanceof Error ? listQuery.error.message : summaryQuery.error instanceof Error ? summaryQuery.error.message : null,
    rows: listQuery.data?.rows || [],
    summary: summaryQuery.data || { total: 0, picked: 0, done: 0 },
    search,
    setSearch,
    status,
    setStatus,
    page,
    setPage,
    totalPages,
    tableCaption,
    selectedDetail,
    setSelectedDetail,
    previewImage,
    setPreviewImage,
    previewTitle,
    setPreviewTitle,
  };
}
