"use client";

import { supabase } from "@/lib/supabase";
import { userQueryKeys } from "@/app/user/queryKeys";
import { RedemptionHistory, Reward, UserProfile } from "../types/reward";

export const USER_REWARD_HISTORY_ITEMS_PER_PAGE = 5;

export type UserRewardBootstrap = {
  userId: string;
  profile: UserProfile | null;
  rewards: Reward[];
  totalRedeemedAmount: number;
};

export const userRewardKeys = userQueryKeys.reward;

export async function getCurrentUserId() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  if (!user) throw new Error("Sesi user tidak ditemukan. Silakan login ulang.");

  return user.id;
}

export async function fetchRewardProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase.from("profiles").select("id, full_name, total_points").eq("id", userId).single();

  if (error || !data) {
    throw new Error("Gagal memuat profil user.");
  }

  return data as UserProfile;
}

export async function fetchRewardCatalog(): Promise<Reward[]> {
  const { data, error } = await supabase
    .from("rewards")
    .select(
      "id, title, description, reward_category, partner_name, redemption_note, fulfillment_type, points_required, amount_value, stock, image_url, is_active",
    )
    .eq("is_active", true)
    .gt("stock", 0)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Gagal memuat reward: ${error.message}`);
  }

  return (data as Reward[]) || [];
}

export async function fetchRewardHistory(userId: string, page: number): Promise<{ rows: RedemptionHistory[]; totalData: number }> {
  const from = (page - 1) * USER_REWARD_HISTORY_ITEMS_PER_PAGE;
  const to = from + USER_REWARD_HISTORY_ITEMS_PER_PAGE - 1;

  const { data, error, count } = await supabase
    .from("redemptions")
    .select(
      "id, created_at, points_spent, amount_added, fulfillment_status, fulfillment_code, rewards:rewards!redemptions_reward_id_fkey(title, reward_category, partner_name, redemption_note, fulfillment_type)",
      { count: "exact" },
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`Gagal memuat riwayat redeem: ${error.message}`);
  }

  return {
    rows: (data as RedemptionHistory[]) || [],
    totalData: count || 0,
  };
}

export async function fetchTotalRedeemedAmount(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from("redemptions")
    .select("amount_added")
    .eq("user_id", userId)
    .eq("status", "completed");

  if (error) {
    throw new Error("Gagal memuat total redeem user.");
  }

  return (data || []).reduce((acc, item) => acc + (item.amount_added || 0), 0);
}

export async function fetchUserRewardBootstrap(): Promise<UserRewardBootstrap> {
  const userId = await getCurrentUserId();
  const [profile, rewards, totalRedeemedAmount] = await Promise.all([
    fetchRewardProfile(userId),
    fetchRewardCatalog(),
    fetchTotalRedeemedAmount(userId),
  ]);

  return {
    userId,
    profile,
    rewards,
    totalRedeemedAmount,
  };
}
