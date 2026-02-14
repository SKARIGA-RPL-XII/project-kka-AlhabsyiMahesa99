import { Eye } from "lucide-react";
import { PickupItem } from "@/types/pickup";
import { StatusBadge } from "./StatusBadge";
import { formatDateTime } from "../utils/format";

export function PickupTable({
  loading,
  errorMessage,
  filteredData,
  totalData,
  currentPage,
  totalPages,
  onPrev,
  onNext,
  onOpenDetail,
}: {
  loading: boolean;
  errorMessage: string | null;
  filteredData: PickupItem[];
  totalData: number;
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onOpenDetail: (item: PickupItem) => void;
}) {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-237.5 text-left">
          <thead className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-400">
            <tr>
              <th className="px-6 py-4 font-bold">ID / Waktu</th>
              <th className="px-6 py-4 font-bold">User</th>
              <th className="px-6 py-4 font-bold">Kategori</th>
              <th className="px-6 py-4 font-bold">Berat</th>
              <th className="px-6 py-4 font-bold">Poin</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 text-center font-bold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-14 text-center text-sm text-gray-400">
                  Memuat data setoran...
                </td>
              </tr>
            ) : errorMessage ? (
              <tr>
                <td colSpan={7} className="px-6 py-14 text-center text-sm text-red-500">
                  Gagal memuat data: {errorMessage}
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-14 text-center text-sm text-gray-400">
                  Data tidak ditemukan untuk filter saat ini.
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/70">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-800">{item.id}</p>
                    <p className="mt-1 text-xs text-gray-400">{formatDateTime(item.createdAt)}</p>
                  </td>

                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-gray-800">{item.customerName}</p>
                    <p className="mt-1 text-xs text-gray-500">{item.customerPhone}</p>
                  </td>

                  <td className="px-6 py-4 text-sm font-medium text-gray-600">{item.category}</td>

                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-gray-800">{item.finalWeight ?? item.estimatedWeight} Kg</p>
                    <p className="mt-1 text-xs text-gray-400">Estimasi {item.estimatedWeight} Kg</p>
                  </td>

                  <td className="px-6 py-4 text-sm font-extrabold text-[#299E63]">
                    {item.points.toLocaleString("id-ID")}
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status={item.status} />
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onOpenDetail(item)}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                      >
                        <Eye size={14} />
                        Detail
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalData > 0 && (
        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
          <p className="text-sm text-gray-400">Halaman {currentPage} dari {totalPages}</p>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={onPrev}
              className="cursor-pointer rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Prev
            </button>

            <span className="px-3 text-sm font-medium text-gray-400">
              {currentPage} / {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={onNext}
              className="cursor-pointer rounded-lg border border-[#299E63] bg-[#299E63] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#238b56] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}
