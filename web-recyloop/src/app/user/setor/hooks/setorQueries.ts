"use client";

import { supabase } from "@/lib/supabase";
import { userQueryKeys } from "@/app/user/queryKeys";

export const USER_SETOR_ITEMS_PER_PAGE = 5;

type WasteCategoryRelation = {
  name: string | null;
} | null;

export type UserSetorPickup = {
  id: string;
  created_at: string;
  status: string;
  estimated_weight: number | null;
  total_weight: number | null;
  total_points_earned: number | null;
  waste_categories: WasteCategoryRelation;
};

export type UserSetorStats = {
  total: number;
  weight: number;
  pending: number;
};

export type UserSetorQueryResult = {
  pickups: UserSetorPickup[];
  stats: UserSetorStats;
};

export const userSetorKeys = userQueryKeys.setor;

export async function fetchUserSetor(): Promise<UserSetorQueryResult> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) {
    return {
      pickups: [],
      stats: { total: 0, weight: 0, pending: 0 },
    };
  }

  const [pickupsRes, allPickupsRes] = await Promise.all([
    supabase
      .from("pickups")
      .select(
        `
          *,
          waste_categories(name)
        `,
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase.from("pickups").select("status, total_weight, estimated_weight").eq("user_id", user.id),
  ]);

  if (pickupsRes.error) throw pickupsRes.error;
  if (allPickupsRes.error) throw allPickupsRes.error;

  const allPickups = allPickupsRes.data || [];
  const totalWeight = allPickups.reduce((acc, curr) => acc + (curr.total_weight || curr.estimated_weight || 0), 0);
  const pendingCount = allPickups.filter((pickup) => pickup.status === "pending").length;

  return {
    pickups: (pickupsRes.data as UserSetorPickup[]) || [],
    stats: {
      total: allPickups.length,
      weight: totalWeight,
      pending: pendingCount,
    },
  };
}
