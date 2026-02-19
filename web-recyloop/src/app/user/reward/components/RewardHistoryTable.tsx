import { Eye } from "lucide-react";
import { RedemptionHistory, RewardRelation } from "../types/reward";

type Props = {
  loading: boolean;
  rows: RedemptionHistory[];
  historyPage: number;
  totalHistoryPages: number;
  formatRupiah: (value: number) => string;
  formatDateTime: (value: string) => string;
  pickFirstRelation: <T>(value: T | T[] | null | undefined) => T | null;
  onOpenDetail: (row: RedemptionHistory) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
};

export function RewardHistoryTable({
  loading,
  rows,
  historyPage,
  totalHistoryPages,
  formatRupiah,
  formatDateTime,
  pickFirstRelation,
  onOpenDetail,
  onPrevPage,
  onNextPage,
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-6 py-4">
        <h2 className="text-lg font-bold">Riwayat Penukaran Terakhir</h2>
      </div>

      {loading ? (
        <div className="px-6 py-6 text-sm text-gray-400">Memuat riwayat...</div>
      ) : rows.length === 0 ? (
        <div className="px-6 py-6 text-sm italic text-gray-500">Belum ada riwayat penukaran.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400">
              <tr>
                <th className="px-6 py-3">Reward</th>
                <th className="px-6 py-3">Kategori</th>
                <th className="px-6 py-3">Poin</th>
                <th className="px-6 py-3">Nominal</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Waktu</th>
                <th className="px-6 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((item) => {
                const reward = pickFirstRelation<RewardRelation>(item.rewards);

                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{reward?.title || "Reward"}</td>
                    <td className="px-6 py-4 text-gray-600">{reward?.reward_category || "-"}</td>
                    <td className="px-6 py-4 font-bold text-amber-600">-{item.points_spent.toLocaleString("id-ID")}</td>
                    <td className="px-6 py-4 font-bold text-[#299E63]">{formatRupiah(item.amount_added)}</td>
                    <td className="px-6 py-4 text-gray-600">{item.fulfillment_status || "completed"}</td>
                    <td className="px-6 py-4 text-gray-600">{formatDateTime(item.created_at)}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => onOpenDetail(item)}
                        className="cursor-pointer inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        <Eye size={14} /> Detail
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {totalHistoryPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
          <p className="text-sm text-gray-500">
            Halaman {historyPage} dari {totalHistoryPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={historyPage === 1}
              onClick={onPrevPage}
              className="cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Prev
            </button>

            <span className="px-2 text-sm text-gray-500">
              {historyPage} / {totalHistoryPages}
            </span>

            <button
              disabled={historyPage === totalHistoryPages}
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
