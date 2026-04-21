"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { adminQueryKeys } from "@/app/admin/queryKeys";
import { createCategory } from "../createCategoryHandler";
import { updateCategory } from "../updateCategory";
import { BadgeDollarSign, Box, Image as ImageIcon, Save, X } from "lucide-react";

type CategoryItem = {
  id: number;
  name: string;
  points_per_kg: number;
  image_url: string | null;
};

type Props = {
  open: boolean;
  mode: "create" | "edit";
  category?: CategoryItem | null;
  onClose: () => void;
};

export function CategoryFormModal({ open, mode, category, onClose }: Props) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [points, setPoints] = useState<number>(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && category) {
      setName(category.name);
      setPoints(category.points_per_kg);
      setImagePreview(category.image_url);
    } else {
      setName("");
      setPoints(0);
      setImagePreview(null);
    }

    setImageFile(null);
  }, [open, mode, category]);

  if (!open) return null;

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (mode === "create" && !imageFile) {
      alert("Gambar wajib diupload");
      return;
    }

    try {
      setLoading(true);

      if (mode === "create") {
        await createCategory({
          name,
          points,
          imageFile: imageFile!,
        });
      } else if (category) {
        await updateCategory({
          id: category.id,
          name,
          points,
          imageFile,
          oldImageUrl: category.image_url,
        });
      }

      await queryClient.invalidateQueries({ queryKey: adminQueryKeys.master.categories });
      alert(mode === "create" ? "Kategori berhasil ditambahkan." : "Kategori berhasil diperbarui.");
      onClose();
    } catch (error) {
      console.error(error);
      alert(mode === "create" ? "Gagal menambahkan kategori." : "Gagal memperbarui kategori.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-gray-100 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between bg-[#222D33] p-6 text-white">
          <div>
            <h2 className="text-xl font-bold font-poppins">
              {mode === "create" ? "Kategori Baru" : "Edit Kategori"}
            </h2>
            <p className="text-sm text-gray-300">
              {mode === "create"
                ? "Tambahkan jenis sampah ke sistem."
                : "Perbarui data kategori sampah"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-200 transition hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-8">
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-6 transition-colors hover:border-[#299E63]/50">
            {imagePreview ? (
              <div className="relative h-32 w-32">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-full w-full rounded-2xl object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setImageFile(null);
                  }}
                  className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow-lg"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center">
                <div className="mb-2 rounded-2xl bg-white p-4 text-[#299E63] shadow-sm">
                  <ImageIcon size={32} />
                </div>
                <span className="text-sm font-bold text-gray-600">
                  Upload Icon/Gambar
                </span>
                <span className="text-[10px] text-gray-400">
                  PNG, JPG up to 2MB
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>

          <div className="space-y-4">
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
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Misal: Plastik HD"
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-black outline-none focus:border-[#299E63]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={points === 0 ? "" : points}
                    onChange={(event) => {
                      let value = event.target.value;

                      // hapus semua selain angka
                      value = value.replace(/[^0-9]/g, "");

                      // convert ke number (default 0 kalau kosong)
                      setPoints(value === "" ? 0 : Number(value));
                    }}
                    placeholder="Masukkan poin"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-black outline-none focus:border-[#299E63]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  Satuan
                </label>
                <div className="flex items-center rounded-2xl border border-gray-200 bg-gray-100 px-4 py-3 font-bold text-gray-500">
                  Kilogram (Kg)
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 cursor-pointer rounded-2xl bg-[#299E63] py-4 font-bold text-white shadow-lg shadow-[#299E63]/20 transition-all hover:bg-[#238b56] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="inline-flex items-center gap-2">
                <Save size={18} />
                {loading
                  ? "Menyimpan..."
                  : mode === "create"
                    ? "Simpan Kategori"
                    : "Simpan Perubahan"}
              </span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-2xl border border-gray-200 px-5 py-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
