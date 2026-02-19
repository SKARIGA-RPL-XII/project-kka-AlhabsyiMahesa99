import { Coins, History, Wallet } from "lucide-react";
import { AuditSummary } from "../types/reward";

type Props = {
  monthlyAudit: AuditSummary;
  formatRupiah: (value: number) => string;
};

export function RewardAuditStats({ monthlyAudit, formatRupiah }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3 text-sm font-semibold text-gray-500">
          <Coins size={18} className="text-[#299E63]" /> Total Poin Terpakai (Bulan Ini)
        </div>
        <p className="mt-2 text-2xl font-bold">{monthlyAudit.pointsSpent.toLocaleString("id-ID")}</p>
      </div>
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3 text-sm font-semibold text-gray-500">
          <Wallet size={18} className="text-[#299E63]" /> Total Rupiah Keluar (Bulan Ini)
        </div>
        <p className="mt-2 text-2xl font-bold">{formatRupiah(monthlyAudit.amountAdded)}</p>
      </div>
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3 text-sm font-semibold text-gray-500">
          <History size={18} className="text-[#299E63]" /> Total Transaksi (Bulan Ini)
        </div>
        <p className="mt-2 text-2xl font-bold">{monthlyAudit.totalTx}</p>
      </div>
    </div>
  );
}
