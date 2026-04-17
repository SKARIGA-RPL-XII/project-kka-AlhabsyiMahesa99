"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type ProfileData = {
  full_name: string;
  email: string;
  phone: string;
  address: string;
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

const initialProfile: ProfileData = {
  full_name: "Memuat...",
  email: "...",
  phone: "-",
  address: "Alamat belum diatur",
  avatar_url: "",
  created_at: "",
  total_points: 0,
};

export function useUserProfile(refreshKey: boolean) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [activities, setActivities] = useState<ProfileActivity[]>([]);

  const pickFirst = <T,>(value: T | T[] | null | undefined): T | null => {
    if (!value) return null;
    return Array.isArray(value) ? (value[0] ?? null) : value;
  };

  const formatDateTime = (value: string) => {
    return new Date(value).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchProfile = useCallback(async () => {
    setLoading(true);

    try {
      // Ambil user dari Auth
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // Ambil data detail dari tabel Profiles
      const [profileRes, activityRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase
          .from("pickups")
          .select("id, created_at, waste_category:waste_categories!pickups_waste_category_id_fkey(name)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(2),
      ]);

      if (profileRes.error) throw profileRes.error;
      if (activityRes.error) throw activityRes.error;

      if (profileRes.data) {
        const data = profileRes.data;
        setProfile({
          full_name: data.full_name || "User Name",
          email: user.email || "",
          phone: data.phone || "-",
          address: data.address || "Alamat belum diatur",
          avatar_url: data.avatar_url || "",
          created_at: data.created_at || user.created_at,
          total_points: data.total_points || 0,
        });
      }

      const mappedActivities = ((activityRes.data || []) as PickupActivity[]).map((item) => {
        const category = pickFirst(item.waste_category);
        return {
          id: item.id,
          title: `Setor ${category?.name || "Sampah"}`,
          time: formatDateTime(item.created_at),
        };
      });

      setActivities(mappedActivities);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile, refreshKey]);

  return {
    loading,
    profile,
    activities,
  };
}
