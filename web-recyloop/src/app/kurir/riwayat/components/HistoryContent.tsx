import { Eye, Image as ImageIcon, Search } from "lucide-react";
import { HistoryRow, STATUS_TABS, StatusFilter } from "../hooks/useCourierHistory";
import { formatDate, formatPickupId, formatWeight, pickFirst, statusBadgeClass, statusLabel } from "./historyUtils";

type Props = {
  loading: boolean;
  summaryLoading: boolean;
  errorMessage: string | null;
  rows: HistoryRow[];
  summary: { total: number; picked: number; done: number };
  search: string;
  onChangeSearch: (value: string) => void;
  status: StatusFilter;
  onChangeStatus: (status: StatusFilter) => void;
  page: number;
  totalPages: number;
  tableCaption: string;
  onPrevPage: () => void;
  onNextPage: () => void;
  onOpenDetail: (row: HistoryRow) => void;
  onOpenPreview: (imageUrl: string, title: string) => void;
};

export function CourierHistoryContent({
  loading,
  summaryLoading,
  errorMessage,
  rows,
  summary,
  search,
  onChangeSearch,
  status,
  onChangeStatus,
  page,
  totalPages,
  tableCaption,
  onPrevPage,
  onNextPage,
  onOpenDetail,
  onOpenPreview,
}: Props) {
  return (
    <div className="space-y-8 font-poppins text-[#1D2B45]">
      <div>
        <h1 className="text-3xl font-bold">Riwayat Jemputan</h1>
        <p className="text-sm text-slate-500">Pantau pickup yang sudah masuk proses kirim dan selesai.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm shadow-blue-100/40">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Total</p>
          <p className="mt-2 text-2xl font-bold">{summaryLoading ? "..." : summary.total.toLocaleString("id-ID")}</p>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm shadow-blue-100/40">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Proses Kirim</p>
          <p className="mt-2 text-2xl font-bold text-blue-700">{summaryLoading ? "..." : summary.picked.toLocaleString("id-ID")}</p>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm shadow-blue-100/40">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Selesai</p>
          <p className="mt-2 text-2xl font-bold text-cyan-700">{summaryLoading ? "..." : summary.done.toLocaleString("id-ID")}</p>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{errorMessage}</div>
      )}

      <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm shadow-blue-100/40">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onChangeStatus(tab.id)}
                className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  status === tab.id
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                    : "border border-blue-100 bg-white text-slate-600 hover:bg-blue-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              value={search}
              onChange={(event) => onChangeSearch(event.target.value)}
              placeholder="Cari user, berat, atau status..."
              className="w-full rounded-lg border border-blue-100 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm shadow-blue-100/40">
        <div className="border-b border-blue-50 px-6 py-4">
          <p className="text-sm font-semibold text-slate-700">Daftar Riwayat</p>
          <p className="text-xs text-slate-500">{tableCaption}</p>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-10 text-center text-sm text-slate-400">Memuat data riwayat kurir...</div>
          ) : rows.length === 0 ? (
            <div className="p-10 text-center text-sm italic text-slate-500">Belum ada riwayat jemputan yang cocok.</div>
          ) : (
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-sm uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-6 py-3">ID / User</th>
                  <th className="px-6 py-3">Berat</th>
                  <th className="px-6 py-3">Tanggal Pickup</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((item) => {
                  const user = pickFirst(item.user);
                  const displayName = user?.full_name || "Pengguna";
                  const imageAlt = `Foto pickup ${displayName}`;

                  return (
                    <tr key={item.id} className="hover:bg-blue-50/40">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {item.pickup_image_url ? (
                            <button
                              type="button"
                              onClick={() => onOpenPreview(item.pickup_image_url!, imageAlt)}
                              className="group relative block h-11 w-11 cursor-pointer overflow-hidden rounded-xl border border-blue-100 shadow-sm"
                              title="Lihat foto pickup"
                            >
                              <img src={item.pickup_image_url} alt={imageAlt} className="h-full w-full object-cover" />
                              <span className="absolute inset-0 flex items-center justify-center bg-slate-900/0 text-white opacity-0 transition group-hover:bg-slate-900/45 group-hover:opacity-100">
                                <ImageIcon size={14} />
                              </span>
                            </button>
                          ) : (
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 text-sm font-bold text-white shadow-sm">
                              {displayName.slice(0, 1).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-slate-800">{displayName}</p>
                            <p className="text-xs text-slate-500">{formatPickupId(item.id)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-700">{formatWeight(item)}</td>
                      <td className="px-6 py-4 text-slate-600">{formatDate(item.created_at)}</td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${statusBadgeClass(item.status)}`}>
                          {statusLabel(item.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => onOpenDetail(item)}
                          className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-blue-100 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-blue-50"
                        >
                          <Eye size={14} /> Detail
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-blue-50 px-6 py-4">
            <p className="text-sm text-slate-500">Halaman {page} dari {totalPages}</p>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1 || loading}
                onClick={onPrevPage}
                className="cursor-pointer rounded-lg border border-blue-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Prev
              </button>
              <span className="px-2 text-sm text-slate-500">
                {page} / {totalPages}
              </span>
              <button
                disabled={page === totalPages || loading}
                onClick={onNextPage}
                className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
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
