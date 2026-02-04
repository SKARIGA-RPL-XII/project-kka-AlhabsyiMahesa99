"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Image as ImageIcon, BadgeDollarSign, Box, X } from "lucide-react";
import { createCategory } from "../createCategoryHandler";

export default function TambahKategori() {
  const [name, setName] = useState("");
  const [points, setPoints] = useState<number>(0);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fungsi preview gambar
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile) {
      alert("Gambar wajib diupload");
      return;
    }

    try {
      setLoading(true);

      await createCategory({
        name,
        points,
        imageFile,
      });

      alert("Berhasil menambahkan kategori baru!");
      router.push("/admin/master");
    } catch (error) {
      console.error(error);
      alert("Gagal menambahkan kategori");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-[#299E63] transition-colors group font-medium cursor-pointer"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Kembali
      </button>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
        <div className="bg-[#222D33] p-8 text-white text-center">
          <h1 className="text-xl font-bold font-poppins">Kategori Baru</h1>
          <p className="text-gray-400 text-sm">Tambahkan jenis sampah ke sistem</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Upload Section */}
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-3xl p-6 hover:border-[#299E63]/50 transition-colors bg-gray-50/50">
            {imagePreview ? (
              <div className="relative w-32 h-32">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
                <button 
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center cursor-pointer">
                <div className="p-4 bg-white rounded-2xl shadow-sm mb-2 text-[#299E63]">
                  <ImageIcon size={32} />
                </div>
                <span className="text-sm font-bold text-gray-600">Upload Icon/Gambar</span>
                <span className="text-[10px] text-gray-400">PNG, JPG up to 2MB</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            )}
          </div>

          <div className="space-y-4">
            {/* Nama Kategori */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Nama Kategori</label>
              <div className="relative">
                <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Misal: Plastik HD"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#299E63] outline-none text-black"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Harga */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Harga (Poin)</label>
                <div className="relative">
                  <BadgeDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    required
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value))}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#299E63] outline-none text-black"
                  />
                </div>
              </div>

              {/* Satuan (Locked to KG) */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Satuan</label>
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-2xl text-gray-500 font-bold flex items-center">
                  Kilogram (Kg)
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#299E63] hover:bg-[#238b56] text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-[#299E63]/20 cursor-pointer"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save size={20} />
                  Simpan Kategori
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}