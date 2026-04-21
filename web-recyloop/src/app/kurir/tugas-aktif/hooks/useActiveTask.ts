"use client";

import { ChangeEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { kurirQueryKeys } from "@/app/kurir/queryKeys";

export type ActiveTaskRow = {
  id: string;
  status: string;
  pickup_address: string | null;
  profiles:
    | { full_name: string | null; phone: string | null }
    | { full_name: string | null; phone: string | null }[]
    | null;
};

async function fetchActiveTask(): Promise<ActiveTaskRow | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("pickups")
    .select("id, status, pickup_address, profiles:user_id(full_name, phone)")
    .eq("kurir_id", user.id)
    .eq("status", "scheduled")
    .maybeSingle();

  if (error) throw error;
  return (data as ActiveTaskRow) || null;
}

export function useActiveTask() {
  const [finalWeight, setFinalWeight] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  const activeTaskQuery = useQuery({
    queryKey: kurirQueryKeys.activeTask.detail("me"),
    queryFn: fetchActiveTask,
    staleTime: 15 * 1000,
  });

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const validatePickupMutation = useMutation({
    mutationFn: async () => {
      const task = activeTaskQuery.data;
      if (!task) throw new Error("Tugas aktif tidak ditemukan.");

      if (!finalWeight || parseFloat(finalWeight) <= 0) {
        throw new Error("Masukkan berat sampah dulu, Bro!");
      }

      if (!imageFile) {
        throw new Error("Foto bukti timbangan wajib ada!");
      }

      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${task.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from("pickup-photos").upload(fileName, imageFile);
      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("pickup-photos").getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from("pickups")
        .update({
          status: "picked_up",
          total_weight: parseFloat(finalWeight),
          pickup_image_url: publicUrl,
        })
        .eq("id", task.id);

      if (updateError) throw updateError;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: kurirQueryKeys.activeTask.all }),
        queryClient.invalidateQueries({ queryKey: kurirQueryKeys.pickupList.all }),
        queryClient.invalidateQueries({ queryKey: kurirQueryKeys.dashboard.all }),
        queryClient.invalidateQueries({ queryKey: kurirQueryKeys.profile.all }),
        queryClient.invalidateQueries({ queryKey: kurirQueryKeys.riwayat.all }),
      ]);
      alert("Mantap! Data terkirim, lanjut setor ke gudang!");
      router.push("/kurir/dashboard");
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Waduh gagal.";
      alert("Waduh gagal: " + message);
    },
  });

  return {
    task: activeTaskQuery.data ?? null,
    loading: activeTaskQuery.isLoading,
    finalWeight,
    setFinalWeight,
    isSubmitting: validatePickupMutation.isPending,
    previewUrl,
    fileInputRef,
    handleFileSelect,
    handleValidationAndPickUp: () => validatePickupMutation.mutate(),
  };
}
