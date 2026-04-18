"use client";

import { supabase } from "@/lib/supabase";
import { userQueryKeys } from "@/app/user/queryKeys";

export type CompletedPickupNotification = {
  id: string;
  created_at: string;
  completed_at: string | null;
  pickup_address: string | null;
  total_weight: number | null;
  total_points_earned: number | null;
  waste_category: { name: string | null } | { name: string | null }[] | null;
};

export const USER_NOTIFICATION_ITEMS_PER_PAGE = 5;

export const userNotificationKeys = userQueryKeys.notifications;

export async function fetchUserNotifications(): Promise<CompletedPickupNotification[]> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) return [];

  const { data, error } = await supabase
    .from("pickups")
    .select(
      `
        id,
        created_at,
        completed_at,
        pickup_address,
        total_weight,
        total_points_earned,
        waste_category:waste_categories!pickups_waste_category_id_fkey(name)
      `,
    )
    .eq("user_id", user.id)
    .eq("status", "completed")
    .order("completed_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Gagal memuat notifikasi.");
  }

  return (data as CompletedPickupNotification[]) || [];
}
