"use client";
import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Plus, Search, Filter, Recycle, Clock, Package, Eye, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { userDashboardKeys } from "@/app/user/dashboard/hooks/dashboardQueries";
import { userProfileKeys } from "@/app/user/profil/hooks/profileQueries";
import { userRiwayatKeys } from "@/app/user/riwayat/hooks/riwayatQueries";
import { USER_SETOR_ITEMS_PER_PAGE, fetchUserSetor, userSetorKeys } from "./hooks/setorQueries";

export default function SetorSampah() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: userSetorKeys.list(currentPage),
    queryFn: () => fetchUserSetor(currentPage),
    staleTime: 30 * 1000,
  });

  const pickups = data?.pickups || [];
  const totalData = data?.totalData || 0;
  const stats = data?.stats || { total: 0, weight: 0, pending: 0 };
  const totalPages = Math.max(1, Math.ceil(totalData / USER_SETOR_ITEMS_PER_PAGE));

  // Helper format tanggal sesuai permintaan "24 Jan 2026"] ---
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Helper Format ID agar terlihat cantik "REC-XXXXX"] ---
  const formatId = (uuid: string) => {
    return `REC-${uuid.substring(0, 5).toUpperCase()}`;
  };

  // Fungsi Hapus - Proteksi hanya status 'pending'] ---
  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Apakah kamu yakin ingin membatalkan setoran ini?");
    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      const { error } = await supabase
        .from("pickups")
        .delete()
        .eq("id", id)
        .eq("status", "pending");

      if (error) throw error;

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: userSetorKeys.all }),
        queryClient.invalidateQueries({ queryKey: userDashboardKeys.all }),
        queryClient.invalidateQueries({ queryKey: userProfileKeys.all }),
        queryClient.invalidateQueries({ queryKey: userRiwayatKeys.all }),
      ]);

      alert("Setoran berhasil dibatalkan.");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Terjadi kesalahan saat membatalkan setoran.";
      alert("Gagal menghapus: " + message);
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "scheduled":
        return "bg-blue-100 text-blue-700";
      case "picked_up":
        return "bg-purple-100 text-purple-700";
      case "pending":
        return "bg-orange-100 text-orange-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="font-poppins space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#222D33]">Data Setoran</h1>
          <p className="text-gray-500 mt-1">
            Pantau dan kelola riwayat setoran sampahmu.
          </p>
        </div>
        <button
          onClick={() => router.push("/user/setor/tambah")}
          className="flex items-center justify-center gap-2 bg-[#299E63] hover:bg-[#238b56] text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-[#299E63]/20 cursor-pointer active:scale-95"
        >
          <Plus size={20} />
          Tambah Setoran
        </button>
      </div>

      {/* Stats Mini - [Data diambil dari state stats] */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-green-100 text-[#299E63] p-3 rounded-xl">
            <Package size={24} />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              Total Setoran
            </p>
            <p className="text-xl font-bold text-[#222D33]">
              {stats.total} Kali
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
            <Recycle size={24} />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              Berat Total
            </p>
            <p className="text-xl font-bold text-[#222D33]">
              {stats.weight.toFixed(1)} Kg
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-[#299E63]/20 text-[#299E63] p-3 rounded-xl">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              Menunggu
            </p>
            <p className="text-xl font-bold text-[#222D33]">
              {stats.pending} Request
            </p>
          </div>
        </div>
      </div>

      {/* Tabel Management */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between gap-4">
          <h3 className="font-bold text-[#222D33]">Riwayat Aktivitas</h3>
          <div className="flex items-center gap-3">
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
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 text-sm font-semibold transition-colors">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-10 text-center text-gray-400 animate-pulse">
              Memuat data transaksi...
            </div>
          ) : pickups.length === 0 ? (
            <div className="p-10 text-center text-gray-400 italic">
              Belum ada riwayat setoran.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50 text-gray-400 text-sm uppercase tracking-widest font-bold">
                <tr>
                  <th className="px-6 py-4">ID & Tanggal</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Berat</th>
                  <th className="px-6 py-4">Poin</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pickups.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      {/* [Tampilan ID & Tanggal Dinamis] */}
                      <div className="text-sm font-bold text-[#222D33]">
                        {formatId(item.id)}
                      </div>
                      <div className="text-[12px] text-gray-400 italic">
                        {formatDate(item.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                      {/* [Ambil data dari join table waste_categories] */}
                      {item.waste_categories?.name || "Kategori"}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-[#222D33]">
                      {/* [Berat menyesuaikan status] */}
                      {item.status === "completed"
                        ? item.total_weight
                        : item.estimated_weight}{" "}
                      Kg
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-[#299E63]">
                        +{item.total_points_earned || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(item.status)}`}
                      >
                        {item.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* [Navigasi Detail] */}
                        <button
                          onClick={() =>
                            router.push(`/user/setor/detail/${item.id}`)
                          }
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Detail"
                        >
                          <Eye size={18} />
                        </button>

                        {/* [Tombol Hapus Kondisional (Hanya Pending)] */}
                        {item.status === "pending" ? (
                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Batalkan Setoran"
                          >
                            <Trash2 size={18} />
                          </button>
                        ) : (
                          <span className="text-[10px] text-gray-300 font-medium italic select-none">
                            Locked
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {totalPages > 1 && (
            <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
              <p className="text-sm text-gray-400">
                Halaman {currentPage} dari {totalPages}
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="
      cursor-pointer px-4 py-2 text-sm font-semibold rounded-lg border
      transition-all duration-200
      disabled:opacity-40 disabled:cursor-not-allowed
      bg-white text-gray-700 border-gray-200
      hover:bg-gray-50 hover:border-gray-300
      active:scale-95
    "
                >
                  Prev
                </button>

                <span className="px-3 text-sm font-medium text-gray-400">
                  {currentPage} / {totalPages}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="
      cursor-pointer px-4 py-2 text-sm font-semibold rounded-lg border
      transition-all duration-200
      disabled:opacity-40 disabled:cursor-not-allowed
      bg-[#299E63] text-white border-[#299E63]
      hover:bg-[#238b56]
      active:scale-95
    "
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
