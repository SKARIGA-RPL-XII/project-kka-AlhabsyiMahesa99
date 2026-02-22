import { AlertCircle, PackageCheck, TrendingUp, Users } from "lucide-react";
import { DashboardStats } from "../types/dashboard";
import { StatCard } from "./StatCard";

type Props = {
  loading: boolean;
  stats: DashboardStats;
  totalWasteTon: string;
};

export function DashboardStatsGrid({ loading, stats, totalWasteTon }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Stats Grid */}
      <StatCard
        title="Total User"
        value={loading ? "..." : stats.totalUsers.toLocaleString("id-ID")}
        icon={<Users />}
        color="blue"
        grow="Realtime"
      />
      <StatCard
        title="Setoran Pending"
        value={loading ? "..." : stats.pendingPickups.toLocaleString("id-ID")}
        icon={<AlertCircle />}
        color="orange"
        grow="Perlu Action"
      />
      <StatCard
        title="Total Sampah"
        value={loading ? "..." : `${totalWasteTon} Ton`}
        icon={<PackageCheck />}
        color="green"
        grow="Realtime"
      />
      <StatCard
        title="Poin Terpakai"
        value={loading ? "..." : stats.totalPointsSpent.toLocaleString("id-ID")}
        icon={<TrendingUp />}
        color="purple"
        grow="Realtime"
      />
    </div>
  );
}
