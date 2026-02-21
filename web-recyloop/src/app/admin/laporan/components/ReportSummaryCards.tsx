import { ReportSummary } from "../types/report";
import { formatRupiah } from "../utils/reportFormat";

type Props = {
  summary: ReportSummary;
};

export function ReportSummaryCards({ summary }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4">
      {/* Summary */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Total Pickups</p>
        <p className="mt-2 text-2xl font-bold">{summary.totalPickups}</p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Total Berat</p>
        <p className="mt-2 text-2xl font-bold">{summary.totalWeight.toFixed(2)} Kg</p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Poin Earned</p>
        <p className="mt-2 text-2xl font-bold">{summary.totalPointsEarned.toLocaleString("id-ID")}</p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Nominal Keluar</p>
        <p className="mt-2 text-2xl font-bold">{formatRupiah(summary.totalAmountAdded)}</p>
      </div>
    </div>
  );
}
