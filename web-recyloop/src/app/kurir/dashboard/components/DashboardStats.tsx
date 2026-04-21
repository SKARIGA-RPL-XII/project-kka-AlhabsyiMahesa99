import { LucideIcon } from "lucide-react";

type StatItem = {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
};

type Props = {
  stats: StatItem[];
};

export function CourierDashboardStats({ stats }: Props) {
  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className={`rounded-xl p-3 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
          </div>
          <p className="text-sm font-medium uppercase tracking-wider text-gray-500">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
