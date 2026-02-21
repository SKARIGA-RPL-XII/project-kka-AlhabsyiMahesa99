import { ReportRedemptionRow } from "../types/report";
import { formatDateTime, formatRupiah, pickFirstRelation } from "../utils/reportFormat";

type Props = {
  rows: ReportRedemptionRow[];
  totalRows: number;
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
};

export function ReportRedemptionsTable({
  rows,
  totalRows,
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* Tabel transaksi ringkas */}
      <div className="border-b border-gray-100 px-6 py-4">
        <h2 className="text-lg font-bold">Log Redemptions ({totalRows})</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400">
            <tr>
              <th className="px-6 py-3">Tanggal</th>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Reward</th>
              <th className="px-6 py-3">Kategori</th>
              <th className="px-6 py-3">Poin Spent</th>
              <th className="px-6 py-3">Nominal</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {rows.map((item) => {
              const profile = pickFirstRelation(item.profiles);
              const reward = pickFirstRelation(item.rewards);

              return (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{formatDateTime(item.created_at)}</td>
                  <td className="px-6 py-4">
                    <p className="font-semibold">{profile?.full_name || "User"}</p>
                    <p className="text-xs text-gray-500">{profile?.email || "-"}</p>
                  </td>
                  <td className="px-6 py-4 font-medium">{reward?.title || "Reward"}</td>
                  <td className="px-6 py-4">{reward?.reward_category || "-"}</td>
                  <td className="px-6 py-4 font-bold text-amber-600">-{item.points_spent.toLocaleString("id-ID")}</td>
                  <td className="px-6 py-4 font-bold text-[#299E63]">{formatRupiah(item.amount_added)}</td>
                  <td className="px-6 py-4">{item.fulfillment_status || item.status || "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
