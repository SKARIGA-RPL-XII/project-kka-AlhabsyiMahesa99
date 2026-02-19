import { Package } from "lucide-react";
import { RedemptionRow } from "../types/reward";

type Props = {
  loading: boolean;
  rows: RedemptionRow[];
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  formatRupiah: (value: number) => string;
  formatDateTime: (value: string) => string;
};

export function RewardTransactionTable({
  loading,
  rows,
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  formatRupiah,
  formatDateTime,
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-gray-100 px-6 py-4">
        <Package size={18} className="text-[#299E63]" />
        <h2 className="text-lg font-bold">Log Transaksi</h2>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="px-6 py-8 text-sm text-gray-400">Memuat transaksi...</div>
        ) : rows.length === 0 ? (
          <div className="px-6 py-8 text-sm italic text-gray-500">Belum ada riwayat penukaran.</div>
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400">
              <tr>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Reward</th>
                <th className="px-6 py-3">Kategori</th>
                <th className="px-6 py-3">Fulfillment</th>
                <th className="px-6 py-3">Poin Terpotong</th>
                <th className="px-6 py-3">Nominal Masuk</th>
                <th className="px-6 py-3">Waktu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-semibold">{item.profile?.full_name || "User"}</p>
                    <p className="text-xs text-gray-500">{item.profile?.email || "-"}</p>
                  </td>
                  <td className="px-6 py-4 font-medium">{item.reward?.title || "Reward"}</td>
                  <td className="px-6 py-4 text-gray-600">{item.reward?.reward_category || "-"}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-semibold text-gray-700">
                      {item.fulfillment_status || item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-amber-600">-{item.points_spent.toLocaleString("id-ID")}</td>
                  <td className="px-6 py-4 font-bold text-[#299E63]">{formatRupiah(item.amount_added)}</td>
                  <td className="px-6 py-4 text-gray-600">{formatDateTime(item.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

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
