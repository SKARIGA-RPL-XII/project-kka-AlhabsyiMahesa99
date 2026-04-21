import { Eye } from "lucide-react";
import { PickupRow } from "../types/riwayat";
import { formatDate, formatPickupId, pickFirst, statusBadgeClass, statusLabel } from "../utils/riwayatFormat";

type Props = {
  loading: boolean;
  rows: PickupRow[];
  currentPage: number;
  totalPages: number;
  onOpenDetail: (row: PickupRow) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
};

export function RiwayatTable({
  loading,
  rows,
  currentPage,
  totalPages,
  onOpenDetail,
  onPrevPage,
  onNextPage,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* Table Riwayat */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-10 text-center text-sm text-gray-400">Memuat data riwayat...</div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center text-sm italic text-gray-500">Belum ada riwayat setoran.</div>
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 text-sm uppercase tracking-wider text-gray-400">
              <tr>
                <th className="px-6 py-3">ID / Waktu Request</th>
                <th className="px-6 py-3">Kategori</th>
                <th className="px-6 py-3">Berat Estimasi</th>
                <th className="px-6 py-3">Berat Final</th>
                <th className="px-6 py-3">Poin</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((item) => {
                const category = pickFirst(item.waste_category);

                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-semibold">{formatPickupId(item.id)}</p>
                      <p className="text-xs text-gray-500">{formatDate(item.created_at)}</p>
                    </td>
                    <td className="px-6 py-4">{category?.name || "-"}</td>
                    <td className="px-6 py-4">{(item.estimated_weight || 0).toLocaleString("id-ID")} Kg</td>
                    <td className="px-6 py-4">{item.total_weight ? `${item.total_weight.toLocaleString("id-ID")} Kg` : "-"}</td>
                    <td className="px-6 py-4 font-bold text-[#299E63]">+{(item.total_points_earned || 0).toLocaleString("id-ID")}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-3 py-1 text-[10px] font-bold ${statusBadgeClass(item.status)}`}>
                        {statusLabel(item.status).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => onOpenDetail(item)}
                        className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                      >
                        <span className="inline-flex items-center gap-1">
                          <Eye size={14} /> Detail
                        </span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
          <p className="text-sm text-gray-500">
            Halaman {currentPage} dari {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={onPrevPage}
              className="cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Prev
            </button>
            <span className="px-2 text-sm text-gray-500">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={onNextPage}
              className="cursor-pointer rounded-lg border border-[#299E63] bg-[#299E63] px-4 py-2 text-sm font-semibold text-white hover:bg-[#238b56] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
