"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Image as ImageIcon, BadgeDollarSign, Box, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function EditKategori() {
  const router = useRouter();
  const { id } = useParams();

  const [name, setName] = useState("");
  const [points, setPoints] = useState<number>(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [oldImageUrl, setOldImageUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchCategory = async () => {
      const { data, error } = await supabase
        .from("waste_categories")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert("Gagal mengambil data kategori");
        router.back();
        return;
      }

      setName(data.name);
      setPoints(data.points_per_kg);
      setImagePreview(data.image_url);
      setOldImageUrl(data.image_url);
      setFetching(false);
    };

    fetchCategory();
  }, [id, router]);

  /* ================= IMAGE PREVIEW ================= */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      let imageUrl = oldImageUrl;

      // upload image baru jika ada
      if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}.${ext}`;
        const filePath = `categories/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("waste_categories")
          .upload(filePath, imageFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("waste_categories")
          .getPublicUrl(filePath);

        imageUrl = data.publicUrl;
      }

      const { error } = await supabase
        .from("waste_categories")
        .update({
          name,
          points_per_kg: points,
          image_url: imageUrl,
        })
        .eq("id", id);

      if (error) throw error;

      alert("Kategori berhasil diperbarui!");
      router.push("/admin/master");
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan perubahan");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="text-gray-400">Loading data...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-[#299E63] transition-colors group font-medium cursor-pointer"
      >
        <ArrowLeft
          size={20}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Kembali
      </button>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#222D33] p-8 text-white text-center">
          <h1 className="text-xl font-bold font-poppins">Edit Kategori</h1>
          <p className="text-gray-400 text-sm">Perbarui data kategori sampah</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Upload */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700">
              Gambar Kategori
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2 block w-full text-sm text-gray-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-lg file:border-0
      file:text-sm file:font-bold
      file:bg-gray-100 file:text-gray-700
      hover:file:bg-gray-200
      cursor-pointer"
            />

            {/* Preview */}
            {imagePreview && (
              <div className="relative w-28 h-28 mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-xl border"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setImageFile(null);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Nama */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">
                Nama Kategori
              </label>
              <div className="relative">
                <Box
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#299E63] outline-none text-black"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Poin */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  Harga (Poin)
                </label>
                <div className="relative">
                  <BadgeDollarSign
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    required
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value))}
                    className="mt-2 w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#299E63] outline-none text-black"
                  />
                </div>
              </div>

              {/* Satuan */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  Satuan
                </label>
                <div className="mt-2 w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-2xl text-gray-500 font-bold flex items-center">
                  Kilogram (Kg)
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2
    bg-yellow-400 hover:bg-yellow-500
    text-gray-900 font-bold
    py-4 rounded-2xl
    transition-all shadow-lg shadow-yellow-400/30
    disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save size={20} />
                Simpan Perubahan
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}