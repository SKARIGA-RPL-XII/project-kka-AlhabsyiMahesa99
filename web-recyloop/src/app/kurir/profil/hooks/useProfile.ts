"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { kurirQueryKeys } from "@/app/kurir/queryKeys";

type CourierProfile = {
  full_name: string;
  email: string;
  address: string;
  phone: string;
  avatar_url: string;
  created_at: string;
  total_pickups: number;
  total_weight: number;
};

const initialProfile: CourierProfile = {
  full_name: "Memuat...",
  email: "...",
  address: "Alamat belum diatur",
  phone: "-",
  avatar_url: "",
  created_at: "",
  total_pickups: 0,
  total_weight: 0,
};

async function fetchCourierProfile(): Promise<CourierProfile> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return initialProfile;

  const { data: profileData, error: profileError } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (profileError) throw profileError;

  const { data: stats } = await supabase
    .from("pickups")
    .select("total_weight")
    .eq("kurir_id", user.id)
    .in("status", ["picked_up", "completed"]);

  const totalKg = stats?.reduce((acc, curr) => acc + (curr.total_weight || 0), 0) || 0;

  return {
    full_name: profileData?.full_name || "Kurir Recyloop",
    email: user.email || "",
    address: profileData?.address || "Alamat belum diatur",
    phone: profileData?.phone || "-",
    avatar_url: profileData?.avatar_url || "",
    created_at: profileData?.created_at || user.created_at,
    total_pickups: stats?.length || 0,
    total_weight: totalKg,
  };
}

export function useProfile(isEditing: boolean) {
  const { data, isLoading } = useQuery({
    queryKey: kurirQueryKeys.profile.detail("me"),
    queryFn: fetchCourierProfile,
    staleTime: 60 * 1000,
    enabled: !isEditing,
  });
  const profile = data || initialProfile;

  const joinDate = useMemo(() => {
    return profile.created_at
      ? new Date(profile.created_at).toLocaleDateString("id-ID", { month: "short", year: "numeric" })
      : "Feb 2026";
  }, [profile.created_at]);

  return { loading: isLoading, profile, joinDate };
}
