import { Eye, Filter, Search, Trash2 } from "lucide-react";
import { UserSetorPickup } from "../hooks/setorQueries";

export type SetorStatusFilter = "all" | "pending" | "scheduled" | "picked_up" | "completed" | "cancelled";

const statusFilterOptions: { value: SetorStatusFilter; label: string }[] = [
  { value: "all", label: "Semua Status" },
  { value: "pending", label: "Pending" },
  { value: "scheduled", label: "Kurir Menuju Lokasi" },
  { value: "picked_up", label: "Proses Timbang" },
  { value: "completed", label: "Selesai" },
  { value: "cancelled", label: "Dibatalkan" },
];

type Props = {
  loading: boolean;
  pickups: UserSetorPickup[];
  deletingId: string | null;
  searchTerm: string;
  activeStatus: SetorStatusFilter;
  currentPage: number;
  totalPages: number;
  formatDate: (dateString: string) => string;
  formatId: (uuid: string) => string;
  getStatusStyle: (status: string) => string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: SetorStatusFilter) => void;
  onOpenDetail: (id: string) => void;
  onDelete: (id: string) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
};

export function SetorTable({
  loading,
  pickups,
  deletingId,
  searchTerm,
  activeStatus,
  currentPage,
  totalPages,
  formatDate,
  formatId,
  getStatusStyle,
  onSearchChange,
  onStatusChange,
  onOpenDetail,
  onDelete,
  onPrevPage,
  onNextPage,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex flex-col justify-between gap-4 border-b border-gray-50 p-6 md:flex-row">
        <h3 className="font-bold text-[#222D33]">Riwayat Aktivitas</h3>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Cari ID..."
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              className="rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-black transition-all focus:border-[#299E63] focus:outline-none focus:ring-2 focus:ring-[#299E63]/20"
            />
          </div>
          <label className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-50">
            <Filter size={16} /> Filter
            <select
              value={activeStatus}
              onChange={(event) => onStatusChange(event.target.value as SetorStatusFilter)}
              className="bg-transparent text-sm font-semibold text-gray-600 outline-none cursor-pointer"
            >
              {statusFilterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="animate-pulse p-10 text-center text-gray-400">Memuat data transaksi...</div>
        ) : pickups.length === 0 ? (
          <div className="p-10 text-center">
            <p className="italic text-gray-400">Tidak ada data yang cocok dengan pencarian atau filter saat ini.</p>
            <p className="mt-2 text-sm text-gray-300">Coba ubah kata kunci pencarian atau pilih status lain.</p>
          </div>
        ) : (
          <table className="w-full border-collapse text-left">
            <thead className="bg-gray-50/50 text-sm font-bold uppercase tracking-widest text-gray-400">
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
                <tr key={item.id} className="transition-colors hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-[#222D33]">{formatId(item.id)}</div>
                    <div className="text-[12px] italic text-gray-400">{formatDate(item.created_at)}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-600">{item.waste_categories?.name || "Kategori"}</td>
                  <td className="px-6 py-4 text-sm font-bold text-[#222D33]">
                    {item.status === "completed" ? item.total_weight : item.estimated_weight} Kg
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-[#299E63]">+{item.total_points_earned || 0}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(item.status)}`}>
                      {item.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onOpenDetail(item.id)}
                        className="cursor-pointer rounded-lg p-2 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                        title="Detail"
                      >
                        <Eye size={18} />
                      </button>

                      {item.status === "pending" ? (
                        <button
                          onClick={() => onDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="cursor-pointer rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                          title="Batalkan Setoran"
                        >
                          <Trash2 size={18} />
                        </button>
                      ) : (
                        <span className="select-none text-[10px] font-medium italic text-gray-300">Locked</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
            <p className="text-sm text-gray-400">
              Halaman {currentPage} dari {totalPages}
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={onPrevPage}
                className="cursor-pointer rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Prev
              </button>

              <span className="px-3 text-sm font-medium text-gray-400">
                {currentPage} / {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={onNextPage}
                className="cursor-pointer rounded-lg border border-[#299E63] bg-[#299E63] px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#238b56] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
