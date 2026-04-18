"use client";

import { supabase } from "@/lib/supabase";
import { userQueryKeys } from "@/app/user/queryKeys";
import { PickupRow, RiwayatSummary, StatusFilter } from "../types/riwayat";

export const ITEMS_PER_PAGE = 5;

export type UserRiwayatQueryParams = {
  currentPage: number;
  activeStatus: StatusFilter;
};

export type UserRiwayatQueryResult = {
  rows: PickupRow[];
  totalData: number;
  allData: PickupRow[];
  summary: RiwayatSummary;
};

export const userRiwayatKeys = {
  ...userQueryKeys.riwayat,
  list: (params: UserRiwayatQueryParams) => userQueryKeys.riwayat.list(params.currentPage, params.activeStatus),
};

export async function fetchUserRiwayat({
  currentPage,
  activeStatus,
}: UserRiwayatQueryParams): Promise<UserRiwayatQueryResult> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) {
    return {
      rows: [],
      totalData: 0,
      allData: [],
      summary: { total: 0, inProgress: 0, done: 0 },
    };
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

  const allData = (summaryData as PickupRow[]) || [];

  return {
    rows: (data as PickupRow[]) || [],
    totalData: count || 0,
    allData,
    summary: {
      total: allData.length,
      inProgress: allData.filter((item) => ["pending", "scheduled", "picked_up"].includes(item.status)).length,
      done: allData.filter((item) => item.status === "completed").length,
    },
  };
}
