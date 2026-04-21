"use client";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { adminQueryKeys } from "@/app/admin/queryKeys";
import { deleteCategory } from "./deleteCategory";
import { CategoryFormModal } from "./components/CategoryFormModal";
import { ImagePreviewModal } from "./components/ImagePreviewModal";
import { MasterCategoriesTable } from "./components/MasterCategoriesTable";
import { MasterOverviewCards } from "./components/MasterOverviewCards";
import type { MasterCategory } from "./types";
import { Plus } from "lucide-react";

async function fetchWasteCategories() {
  const { data, error } = await supabase
    .from("waste_categories")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as MasterCategory[];
}

async function fetchTotalVolumeKg() {
  const { data, error } = await supabase
    .from("pickups")
    .select("total_weight, estimated_weight");

  if (error) throw error;

  return (data || []).reduce((total, item) => {
    return total + (item.total_weight || item.estimated_weight || 0);
  }, 0);
}

function matchesCategorySearch(item: MasterCategory, searchTerm: string) {
  const keyword = searchTerm.trim().toLowerCase();
  if (!keyword) return true;

  return (
    item.name.toLowerCase().includes(keyword) ||
    String(item.points_per_kg).includes(keyword) ||
    new Date(item.created_at).toLocaleDateString("id-ID").toLowerCase().includes(keyword)
  );
}

export default function ManajemenDataMaster() {
  const queryClient = useQueryClient();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: categories = [], isLoading: loading } = useQuery({
    queryKey: adminQueryKeys.master.categories,
    queryFn: fetchWasteCategories,
    staleTime: 5 * 60 * 1000,
  });
  const { data: totalVolumeKg = 0 } = useQuery({
    queryKey: adminQueryKeys.master.totalVolume,
    queryFn: fetchTotalVolumeKg,
    staleTime: 5 * 60 * 1000,
  });
  const filteredCategories = categories.filter((item) =>
    matchesCategorySearch(item, searchTerm),
  );
  const selectedCategory = categories.find((item) => item.id === selectedCategoryId) || null;
  const highestPoint = categories.length > 0 ? Math.max(...categories.map((c) => c.points_per_kg)) : 0;

  const handleDelete = async (id: string, imageUrl?: string | null) => {
    const confirmDelete = confirm(
      "Yakin mau hapus kategori ini? Data tidak bisa dikembalikan.",
    );

    if (!confirmDelete) return;

    try {
      await deleteCategory(id, imageUrl);
      await queryClient.invalidateQueries({ queryKey: adminQueryKeys.master.categories });

      alert("Kategori berhasil dihapus");
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus kategori karena sudah ada setoran bertipe tersebut!");
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
          onClick={() => {
            setSelectedCategoryId(null);
            setModalMode("create");
          }}
          className="cursor-pointer flex items-center gap-2 bg-[#299E63] hover:bg-[#238b56] text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-[#299E63]/20"
        >
          <Plus size={20} />
          Tambah Kategori
        </button>
      </div>

      {/* Overview */}
      <MasterOverviewCards
        totalCategories={categories.length}
        highestPoint={highestPoint}
        totalVolumeKg={totalVolumeKg}
      />

      {/* Table */}
      <MasterCategoriesTable
        categories={filteredCategories}
        loading={loading}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onPreviewImage={setPreviewImage}
        onEdit={(categoryId) => {
          setSelectedCategoryId(categoryId);
          setModalMode("edit");
        }}
        onDelete={(categoryId, imageUrl) =>
          handleDelete(String(categoryId), imageUrl)
        }
      />

      <ImagePreviewModal
        imageUrl={previewImage}
        onClose={() => setPreviewImage(null)}
      />

      <CategoryFormModal
        open={modalMode !== null}
        mode={modalMode || "create"}
        category={modalMode === "edit" ? selectedCategory : null}
        onClose={() => {
          setModalMode(null);
          setSelectedCategoryId(null);
        }}
      />
    </div>
  );
}
