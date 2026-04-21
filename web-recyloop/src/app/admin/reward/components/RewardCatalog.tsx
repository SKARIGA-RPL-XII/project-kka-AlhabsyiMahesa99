"use client";

import { useMemo, useState } from "react";
import { Ban, Eye, Filter, Gift, Pencil, Search, X } from "lucide-react";
import { Reward } from "../types/reward";

type RewardStatusFilter = "all" | "active" | "inactive";
const ITEMS_PER_PAGE = 5;

type Props = {
  loading: boolean;
  rewards: Reward[];
  formatRupiah: (value: number) => string;
  onEditStock: (reward: Reward) => void;
  onToggleActive: (reward: Reward) => void;
};

export function RewardCatalog({
  loading,
  rewards,
  formatRupiah,
  onEditStock,
  onToggleActive,
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<RewardStatusFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const filteredRewards = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return rewards.filter((reward) => {
      const matchesSearch =
        !keyword ||
        reward.title.toLowerCase().includes(keyword) ||
        reward.reward_category.toLowerCase().includes(keyword) ||
        (reward.partner_name || "").toLowerCase().includes(keyword) ||
        reward.fulfillment_type.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && reward.is_active) ||
        (statusFilter === "inactive" && !reward.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [rewards, searchTerm, statusFilter]);
  const totalPages = Math.max(1, Math.ceil(filteredRewards.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedRewards = filteredRewards.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2">
          <Gift size={18} className="text-[#299E63]" />
          <div>
            <h2 className="text-lg font-bold">Katalog Control</h2>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari reward, kategori, partner..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-black outline-none transition focus:border-[#299E63] focus:ring-2 focus:ring-[#299E63]/20 md:w-72"
            />
          </div>

          <label className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600">
            <Filter size={16} />
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value as RewardStatusFilter);
                setCurrentPage(1);
              }}
              className="cursor-pointer bg-transparent outline-none"
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </select>
          </label>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Memuat katalog reward...</p>
      ) : filteredRewards.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center">
          <p className="text-sm text-gray-500">Belum ada reward yang cocok dengan pencarian atau filter ini.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50 text-sm font-bold uppercase tracking-wider text-gray-400">
                <tr>
                  <th className="px-5 py-4">Reward</th>
                  <th className="px-5 py-4">Kategori</th>
                  <th className="px-5 py-4">Fulfillment</th>
                  <th className="px-5 py-4">Poin</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedRewards.map((reward) => (
                  <tr key={reward.id} className="align-top hover:bg-gray-50/70">
                    <td className="px-5 py-4">
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => reward.image_url && setPreviewImage(reward.image_url)}
                          className="h-12 w-12 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 cursor-pointer"
                        >
                          {reward.image_url ? (
                            <img src={reward.image_url} alt={reward.title} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-sm font-bold text-gray-300">
                              IMG
                            </div>
                          )}
                        </button>
                        <div className="min-w-55">
                          <p className="font-bold text-[#222D33]">{reward.title}</p>
                          <p className="mt-1 text-sm text-gray-500">{reward.partner_name || "Partner Umum"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold text-[#222D33]">{reward.reward_category}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold text-[#222D33]">
                        {reward.fulfillment_type === "code" ? "Kode Otomatis" : "Manual Admin"}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-bold text-[#222D33]">
                      {reward.points_required.toLocaleString("id-ID")}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          reward.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {reward.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedReward(reward)}
                          className="cursor-pointer rounded-lg p-2.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-700"
                          title="Detail"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => onEditStock(reward)}
                          className="cursor-pointer rounded-lg p-2.5 text-gray-400 transition-colors hover:bg-amber-50 hover:text-amber-600"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => onToggleActive(reward)}
                          className={`cursor-pointer rounded-lg p-2.5 transition-colors ${
                            reward.is_active
                              ? "text-gray-400 hover:bg-red-50 hover:text-red-600"
                              : "text-gray-400 hover:bg-green-50 hover:text-green-700"
                          }`}
                          title={reward.is_active ? "Nonaktifkan" : "Aktifkan"}
                        >
                          <Ban size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 px-5 py-4">
              <p className="text-sm text-gray-400">
                Halaman {safeCurrentPage} dari {totalPages}
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={safeCurrentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="cursor-pointer rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Prev
                </button>
                <span className="px-3 text-sm font-medium text-gray-400">
                  {safeCurrentPage} / {totalPages}
                </span>
                <button
                  disabled={safeCurrentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="cursor-pointer rounded-lg border border-[#299E63] bg-[#299E63] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#238b56] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {selectedReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={() => setSelectedReward(null)}>
          <div className="w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-3xl border border-gray-100 bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h3 className="text-xl font-bold text-[#222D33]">{selectedReward.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{selectedReward.partner_name || "Partner Umum"}</p>
              </div>
              <button
                onClick={() => setSelectedReward(null)}
                className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
                {selectedReward.image_url ? (
                  <img src={selectedReward.image_url} alt={selectedReward.title} className="h-48 w-full object-cover" />
                ) : (
                  <div className="flex h-64 items-center justify-center text-sm font-semibold text-gray-300">Tidak ada gambar</div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-gray-100 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Kategori</p>
                  <p className="mt-1 text-sm font-semibold text-[#222D33]">{selectedReward.reward_category}</p>
                </div>
                <div className="rounded-2xl border border-gray-100 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Fulfillment</p>
                  <p className="mt-1 text-sm font-semibold text-[#222D33]">{selectedReward.fulfillment_type === "code" ? "Kode Otomatis" : "Manual Admin"}</p>
                </div>
                <div className="rounded-2xl border border-gray-100 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Poin Dibutuhkan</p>
                  <p className="mt-1 text-sm font-semibold text-[#222D33]">{selectedReward.points_required.toLocaleString("id-ID")}</p>
                </div>
                <div className="rounded-2xl border border-gray-100 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Status</p>
                  <p className="mt-1 text-sm font-semibold text-[#222D33]">{selectedReward.is_active ? "Aktif" : "Nonaktif"}</p>
                </div>
                <div className="rounded-2xl border border-gray-100 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Nominal</p>
                  <p className="mt-1 text-sm font-semibold text-[#222D33]">{formatRupiah(selectedReward.amount_value)}</p>
                </div>
                <div className="rounded-2xl border border-gray-100 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Stok / Limit</p>
                  <p className="mt-1 text-sm font-semibold text-[#222D33]">{(selectedReward.stock ?? 0).toLocaleString("id-ID")}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Deskripsi</p>
                <p className="mt-2 text-sm leading-7 text-gray-600">{selectedReward.description || "Reward ini belum punya deskripsi tambahan."}</p>
              </div>

              <div className="rounded-2xl border border-gray-100 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Detail Klaim</p>
                <p className="mt-2 text-sm leading-7 text-gray-600">{selectedReward.redemption_note || "Tidak ada catatan tambahan untuk proses klaim reward ini."}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={() => setPreviewImage(null)}>
          <div className="w-full max-w-lg rounded-3xl bg-white p-4 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <img src={previewImage} alt="Preview reward" className="w-full rounded-2xl object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
