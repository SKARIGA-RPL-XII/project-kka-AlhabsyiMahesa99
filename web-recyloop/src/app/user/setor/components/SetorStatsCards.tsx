import { Clock, Package, Recycle } from "lucide-react";
import { UserSetorStats } from "../hooks/setorQueries";

type Props = {
  stats: UserSetorStats;
};

export function SetorStatsCards({ stats }: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="rounded-xl bg-green-100 p-3 text-[#299E63]">
          <Package size={24} />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Setoran</p>
          <p className="text-xl font-bold text-[#222D33]">{stats.total} Kali</p>
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
          <Recycle size={24} />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Berat Total</p>
          <p className="text-xl font-bold text-[#222D33]">{stats.weight.toFixed(1)} Kg</p>
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="rounded-xl bg-[#299E63]/20 p-3 text-[#299E63]">
          <Clock size={24} />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Menunggu</p>
          <p className="text-xl font-bold text-[#222D33]">{stats.pending} Request</p>
        </div>
      </div>
    </div>
  );
}
