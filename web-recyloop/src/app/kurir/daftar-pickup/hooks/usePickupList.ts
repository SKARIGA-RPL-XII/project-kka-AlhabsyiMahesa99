"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { kurirQueryKeys } from "@/app/kurir/queryKeys";

export type PickupListRow = {
  id: string;
  created_at: string;
  estimated_weight: number | null;
  pickup_address: string | null;
  notes: string | null;
  image_url: string | null;
  profiles: { full_name: string | null } | { full_name: string | null }[] | null;
};

type PickupListQueryResult = {
  pickups: PickupListRow[];
  hasScheduledTask: boolean;
};

async function fetchScheduledTask(userId: string) {
  const { data, error } = await supabase
    .from("pickups")
    .select("id")
    .eq("kurir_id", userId)
    .eq("status", "scheduled")
    .limit(1);

  if (error) throw error;
  return Boolean(data && data.length > 0);
}

async function fetchPickupList(): Promise<PickupListQueryResult> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [pickupsResult, hasActiveTask] = await Promise.all([
    supabase
      .from("pickups")
      .select(
        `
          id,
          created_at,
          estimated_weight,
          pickup_address,
          notes,
          image_url,
          profiles:user_id(full_name)
        `,
      )
      .eq("status", "pending")
      .order("created_at", { ascending: false }),
    user ? fetchScheduledTask(user.id) : Promise.resolve(false),
  ]);

  const { data, error } = pickupsResult;
  if (error) throw error;

  return {
    pickups: (data as PickupListRow[]) || [],
    hasScheduledTask: hasActiveTask,
  };
}

export function usePickupList() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const listQuery = useQuery({
    queryKey: kurirQueryKeys.pickupList.detail("me"),
    queryFn: fetchPickupList,
    staleTime: 30 * 1000,
  });

  const takeTaskMutation = useMutation({
    mutationFn: async (pickupId: string) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Waduh, lu harus login dulu bro!");
      }

      const alreadyHasScheduledTask = await fetchScheduledTask(user.id);
      if (alreadyHasScheduledTask) {
        throw new Error("__HAS_ACTIVE_TASK__");
      }

      const { error } = await supabase
        .from("pickups")
        .update({
          status: "scheduled",
          kurir_id: user.id,
        })
        .eq("id", pickupId)
        .eq("status", "pending");

      if (error) throw error;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: kurirQueryKeys.pickupList.all }),
        queryClient.invalidateQueries({ queryKey: kurirQueryKeys.activeTask.all }),
        queryClient.invalidateQueries({ queryKey: kurirQueryKeys.dashboard.all }),
      ]);
      alert("Tugas berhasil diambil! Gas ke lokasi, Bro.");
      router.push("/kurir/tugas-aktif");
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Gagal ambil tugas. Mungkin sudah diambil kurir lain.";
      if (message === "__HAS_ACTIVE_TASK__") {
        alert("Lu masih punya tugas aktif yang belum selesai. Beresin dulu tugas yang sekarang, bro.");
        router.push("/kurir/tugas-aktif");
        return;
      }

      console.error("Gagal ambil tugas:", message);
      alert(message);
    },
  });

  return {
    pickups: listQuery.data?.pickups || [],
    loading: listQuery.isLoading,
    hasScheduledTask: listQuery.data?.hasScheduledTask || false,
    takingTaskId: takeTaskMutation.isPending ? (takeTaskMutation.variables ?? null) : null,
    handleAmbilTugas: (pickupId: string) => takeTaskMutation.mutate(pickupId),
  };
}
