"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { deleteCategory } from "./deleteCategory";
import { Plus, Search, Filter, Edit3, Trash2, TrendingUp, Layers, ImageIcon, Database } from "lucide-react";

export default function ManajemenDataMaster() {
  const router = useRouter();

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("waste_categories")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setCategories(data || []);
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  const highestPoint =
    categories.length > 0
      ? Math.max(...categories.map((c) => c.points_per_kg))
      : 0;

  const handleDelete = async (id: string, imageUrl?: string | null) => {
    const confirmDelete = confirm(
      "Yakin mau hapus kategori ini? Data tidak bisa dikembalikan.",
    );

    if (!confirmDelete) return;

    try {
      await deleteCategory(id, imageUrl);

      // update UI tanpa reload
      setCategories((prev) => prev.filter((item) => item.id !== id));

      alert("Kategori berhasil dihapus");
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus kategori");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#222D33] font-poppins">
            Data Master Kategori
          </h1>
          <p className="text-gray-500 font-poppins mt-1">
            Kelola daftar sampah dan harga konversi poin per Kg.
          </p>
        </div>
        <button
          onClick={() => router.push("/admin/master/tambah")}
          className="flex items-center gap-2 bg-[#299E63] hover:bg-[#238b56] text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-[#299E63]/20"
        >
          <Plus size={20} />
          Tambah Kategori
        </button>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-5">
          <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl">
            <Layers size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
              Total Jenis
            </p>
            <p className="text-2xl font-bold text-[#222D33]">
              {categories.length}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-5">
          <div className="bg-green-50 text-[#299E63] p-4 rounded-2xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
              Poin Tertinggi
            </p>
            <p className="text-2xl font-bold text-[#222D33]">{highestPoint}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-5">
          <div className="bg-orange-50 text-orange-600 p-4 rounded-2xl">
            <Database size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
              Total Volume
            </p>
            <p className="text-2xl font-bold text-[#222D33]">
              1.240 <span className="text-xs text-gray-400">Kg</span>
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b flex justify-between">
          <h3 className="font-bold text-[#222D33] font-poppins">Data Master</h3>
          <div className="flex items-center gap-3">
            {/* Search Area */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Cari ID..."
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#299E63]/20 focus:border-[#299E63] transition-all text-black"
              />
            </div>
            {/* Filter Button */}
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 text-sm font-semibold transition-colors">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/50 text-gray-400 text-sm uppercase tracking-widest font-bold">
            <tr>
              <th className="px-8 py-5">Info Kategori</th>
              <th className="px-8 py-5 text-center">Satuan</th>
              <th className="px-8 py-5">Harga (Poin)</th>
              <th className="px-8 py-5">Terakhir Update</th>
              <th className="px-8 py-5 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-8 py-10 text-center text-gray-400"
                >
                  Loading data...
                </td>
              </tr>
            ) : (
              categories.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div
                        onClick={() =>
                          item.image_url && setPreviewImage(item.image_url)
                        }
                        className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center border cursor-pointer hover:opacity-80 transition"
                      >
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon size={20} className="text-gray-400" />
                        )}
                      </div>
                      <span className="text-sm font-bold text-gray-800">
                        {item.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-8 py-5 text-center">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold">
                      Kg
                    </span>
                  </td>

                  <td className="px-8 py-5">
                    <div className="text-sm font-extrabold text-[#299E63]">
                      {item.points_per_kg.toLocaleString("id-ID")}
                    </div>
                  </td>

                  <td className="px-8 py-5 text-sm text-gray-500 font-medium">
                    {new Date(item.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  <td className="px-8 py-5">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => router.push(`/admin/master/${item.id}/edit`)}
                        className="p-2.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl cursor-pointer">
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id, item.image_url)}
                        className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl cursor-pointer">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {previewImage && (
          <div
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
            onClick={() => setPreviewImage(null)}
          >
            <div
              className="bg-white p-4 rounded-2xl max-w-lg w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-auto rounded-xl object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
