"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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
  const [loading, setLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [formData, setFormData] = useState<EditProfileFormData>(initialFormData);

  // 2. Ambil data profil saat halaman dibuka
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (error) throw error;

      if (data) {
        setFormData({
          full_name: data.full_name || "",
          phone: data.phone || "",
          email: user.email || "",
          address: data.address || "",
          district: data.district || "",
          city: data.city || "",
          latitude: data.latitude,
          longitude: data.longitude,
          avatar_url: data.avatar_url || "",
        });
        setPreviewUrl(data.avatar_url || `https://ui-avatars.com/api/?name=${data.full_name}&background=299E63&color=fff`);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  // 3. Fungsi Get Location (GPS)
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
            district: data.address.suburb || data.address.village || data.address.county || "",
            city: data.address.city || data.address.regency || "",
          }));
        } catch (err) {
          console.error(err);
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        alert("Gagal mengambil lokasi");
        setIsLocating(false);
      },
    );
  };

  // Handle Pilih File Gambar
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // 4. Handle Save (Update Profile & Upload Foto)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User tidak ditemukan");

      let currentAvatarUrl = formData.avatar_url;

      // Proses Upload Foto jika ada file baru
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

      // Update Tabel Profiles
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
      alert("Profil berhasil diperbarui!");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Gagal menyimpan profil.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    isLocating,
    formData,
    previewUrl,
    setFormData,
    getLocation,
    handleSave,
    handleFileChange,
  };
}
