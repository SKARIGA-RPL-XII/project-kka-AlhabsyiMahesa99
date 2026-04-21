"use client";

import { Edit3, ImageIcon, Search, Trash2 } from "lucide-react";
import type { MasterCategory } from "../types";

type MasterCategoriesTableProps = {
  categories: MasterCategory[];
  loading: boolean;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onPreviewImage: (imageUrl: string) => void;
  onEdit: (categoryId: number) => void;
  onDelete: (categoryId: number, imageUrl?: string | null) => void;
};

function formatCategoryDate(value: string) {
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function MasterCategoriesTable({
  categories,
  loading,
  searchTerm,
  onSearchTermChange,
  onPreviewImage,
  onEdit,
  onDelete,
}: MasterCategoriesTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="flex justify-between border-b p-6">
        <h3 className="font-poppins font-bold text-[#222D33]">Data Master</h3>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => onSearchTermChange(event.target.value)}
              placeholder="Cari nama kategori, poin, atau tanggal..."
              className="w-[320px] rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-black transition-all focus:border-[#299E63] focus:outline-none focus:ring-2 focus:ring-[#299E63]/20 md:w-105"
            />
          </div>
        </div>
      </div>

      <table className="w-full border-collapse text-left">
        <thead className="bg-gray-50/50 text-sm font-bold uppercase tracking-widest text-gray-400">
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
              <td colSpan={5} className="px-8 py-10 text-center text-gray-400">
                Loading data...
              </td>
            </tr>
          ) : categories.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-8 py-10 text-center text-sm text-gray-400"
              >
                Tidak ada kategori yang cocok dengan pencarian atau filter.
              </td>
            </tr>
          ) : (
            categories.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div
                      onClick={() => item.image_url && onPreviewImage(item.image_url)}
                      className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-2xl border bg-gray-100 transition hover:opacity-80"
                    >
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="h-full w-full object-cover"
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
                  <span className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">
                    Kg
                  </span>
                </td>

                <td className="px-8 py-5">
                  <div className="text-sm font-extrabold text-[#299E63]">
                    {item.points_per_kg.toLocaleString("id-ID")}
                  </div>
                </td>

                <td className="px-8 py-5 text-sm font-medium text-gray-500">
                  {formatCategoryDate(item.created_at)}
                </td>

                <td className="px-8 py-5">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onEdit(item.id)}
                      className="cursor-pointer rounded-xl p-2.5 text-gray-400 hover:bg-amber-50 hover:text-amber-600"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(item.id, item.image_url)}
                      className="cursor-pointer rounded-xl p-2.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
