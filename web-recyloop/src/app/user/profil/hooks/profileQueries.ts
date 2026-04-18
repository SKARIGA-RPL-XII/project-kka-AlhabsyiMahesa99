"use client";

import { supabase } from "@/lib/supabase";
import { userQueryKeys } from "@/app/user/queryKeys";

export type ProfileData = {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  district?: string;
  city?: string;
  latitude?: number | null;
  longitude?: number | null;
  avatar_url: string;
  created_at: string;
  total_points: number;
};

type PickupActivity = {
  id: string;
  created_at: string;
  waste_category: { name: string | null } | { name: string | null }[] | null;
};

export type ProfileActivity = {
  id: string;
  title: string;
  time: string;
};

export type UserProfileQueryResult = {
  userId: string;
  profile: ProfileData;
  activities: ProfileActivity[];
};

export const initialProfile: ProfileData = {
  full_name: "Memuat...",
  email: "...",
  phone: "-",
  address: "Alamat belum diatur",
  district: "",
  city: "",
  latitude: null,
  longitude: null,
  avatar_url: "",
  created_at: "",
  total_points: 0,
};

export const userProfileKeys = userQueryKeys.profile;

const pickFirst = <T,>(value: T | T[] | null | undefined): T | null => {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
};

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

async function getCurrentUserId() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  if (!user) throw new Error("User tidak ditemukan.");

  return user;
}

export async function fetchUserProfile(userId?: string): Promise<UserProfileQueryResult> {
  const currentUser = userId ? { id: userId, email: "", created_at: "" } : await getCurrentUserId();

  const [profileRes, activityRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", currentUser.id).single(),
    supabase
      .from("pickups")
      .select("id, created_at, waste_category:waste_categories!pickups_waste_category_id_fkey(name)")
      .eq("user_id", currentUser.id)
      .order("created_at", { ascending: false })
      .limit(2),
  ]);

  if (profileRes.error) throw profileRes.error;
  if (activityRes.error) throw activityRes.error;

  const profileData = profileRes.data;
  const resolvedEmail = profileData?.email || currentUser.email || "";
  const resolvedCreatedAt = profileData?.created_at || currentUser.created_at || "";

  const activities = ((activityRes.data || []) as PickupActivity[]).map((item) => {
    const category = pickFirst(item.waste_category);

    return {
      id: item.id,
      title: `Setor ${category?.name || "Sampah"}`,
      time: formatDateTime(item.created_at),
    };
  });

  return {
    userId: currentUser.id,
    profile: {
      full_name: profileData?.full_name || "User Name",
      email: resolvedEmail,
      phone: profileData?.phone || "-",
      address: profileData?.address || "Alamat belum diatur",
      district: profileData?.district || "",
      city: profileData?.city || "",
      latitude: profileData?.latitude ?? null,
      longitude: profileData?.longitude ?? null,
      avatar_url: profileData?.avatar_url || "",
      created_at: resolvedCreatedAt,
      total_points: profileData?.total_points || 0,
    },
    activities,
  };
}
