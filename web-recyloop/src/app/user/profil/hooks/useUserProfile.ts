"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile, initialProfile, userProfileKeys } from "./profileQueries";

export type { ProfileActivity } from "./profileQueries";

export function useUserProfile() {
  const { data, isLoading } = useQuery({
    queryKey: userProfileKeys.detail("me"),
    queryFn: () => fetchUserProfile(),
    staleTime: 60 * 1000,
  });

  return {
    loading: isLoading,
    profile: data?.profile ?? initialProfile,
    activities: data?.activities ?? [],
    userId: data?.userId ?? null,
  };
}
