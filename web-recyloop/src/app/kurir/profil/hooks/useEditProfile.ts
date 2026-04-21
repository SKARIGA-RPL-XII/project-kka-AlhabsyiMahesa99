"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { kurirQueryKeys } from "@/app/kurir/queryKeys";

export type EditProfileFormData = {
  full_name: string;
  phone: string;
  email: string;
  address: string;
  district: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  avatar_url: string;
};

const initialFormData: EditProfileFormData = {
  full_name: "",
  phone: "",
  email: "",
  address: "",
  district: "",
  city: "",
  latitude: null,
  longitude: null,
  avatar_url: "",
};

export function useEditProfile() {
  const [isLocating, setIsLocating] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [formData, setFormData] = useState<EditProfileFormData>(initialFormData);
  const [hasHydratedForm, setHasHydratedForm] = useState(false);
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: kurirQueryKeys.profile.detail("me"),
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return initialFormData;

      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (error) throw error;

      return {
        full_name: data?.full_name || "",
        phone: data?.phone || "",
        email: user.email || "",
        address: data?.address || "",
        district: data?.district || "",
        city: data?.city || "",
        latitude: data?.latitude ?? null,
        longitude: data?.longitude ?? null,
        avatar_url: data?.avatar_url || "",
      } as EditProfileFormData;
    },
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (!profileQuery.data || hasHydratedForm) return;

    setFormData(profileQuery.data);
    setPreviewUrl(profileQuery.data.avatar_url || `https://ui-avatars.com/api/?name=${profileQuery.data.full_name}&background=2563eb&color=fff`);
    setHasHydratedForm(true);
  }, [hasHydratedForm, profileQuery.data]);

  const getLocation = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      alert("Browser tidak mendukung geolokasi");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();

          setFormData((prev) => ({
            ...prev,
            latitude,
            longitude,
            address: data.display_name,
            district: data.address.suburb || data.address.village || data.address.municipality || "",
            city: data.address.city || data.address.regency || "",
          }));
        } catch (error) {
          console.error("Geocoding error:", error);
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        alert("Gagal mengambil lokasi. Pastikan GPS aktif.");
        setIsLocating(false);
      },
    );
  };

  const saveProfileMutation = useMutation({
    mutationFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User tidak ditemukan");

      let currentAvatarUrl = formData.avatar_url;

      if (selectedFile) {
        const fileExt = selectedFile.name.split(".").pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage.from("avatars").upload(fileName, selectedFile, { upsert: true });
        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(fileName);

        currentAvatarUrl = publicUrl;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          address: formData.address,
          district: formData.district,
          city: formData.city,
          latitude: formData.latitude,
          longitude: formData.longitude,
          avatar_url: currentAvatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      return currentAvatarUrl;
    },
    onSuccess: async (avatarUrl) => {
      setFormData((prev) => ({ ...prev, avatar_url: avatarUrl }));
      setHasHydratedForm(false);
      await queryClient.invalidateQueries({ queryKey: kurirQueryKeys.profile.all });
      alert("Profil Kurir berhasil diperbarui!");
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Gagal menyimpan profil.";
      alert(message);
    },
  });

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    await saveProfileMutation.mutateAsync();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return {
    loading: profileQuery.isLoading || saveProfileMutation.isPending,
    isLocating,
    formData,
    previewUrl,
    setFormData,
    getLocation,
    handleSave,
    handleFileChange,
  };
}
