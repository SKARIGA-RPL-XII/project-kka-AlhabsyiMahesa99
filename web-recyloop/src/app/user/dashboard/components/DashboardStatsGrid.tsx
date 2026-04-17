import { DashboardStatItem } from "../types/dashboard";

type Props = {
  stats: DashboardStatItem[];
};

export default function DashboardStatsGrid({ stats }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Stats Grid - 4 Kolom di Desktop */}
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
              <stat.icon size={24} />
            </div>
            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
          </div>
          <div className="mt-4">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider font-poppins">{stat.title}</p>
            <h3 className="text-xl font-bold text-[#222D33] mt-1 flex items-baseline gap-1 font-poppins">
              {stat.value}
              <span className="text-xs font-normal text-gray-400">{stat.unit}</span>
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
}
