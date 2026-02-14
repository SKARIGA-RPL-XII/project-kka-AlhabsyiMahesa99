import { AlertTriangle, Loader2, PackageSearch, ShieldCheck } from "lucide-react";

function OverviewCard({
  title,
  value,
  icon,
  palette,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  palette: "slate" | "amber" | "blue" | "green";
}) {
  const paletteClass: Record<typeof palette, string> = {
    slate: "bg-slate-100 text-slate-700",
    amber: "bg-amber-100 text-amber-700",
    blue: "bg-blue-100 text-blue-700",
    green: "bg-emerald-100 text-emerald-700",
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className={`rounded-xl p-3 ${paletteClass[palette]}`}>{icon}</div>
      </div>
      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{title}</p>
      <p className="mt-1 text-2xl font-bold text-[#222D33]">{value.toLocaleString("id-ID")}</p>
    </div>
  );
}

export function OverviewStats({
  total,
  pending,
  inProgress,
  completed,
}: {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <OverviewCard title="Total Setoran" value={total} icon={<PackageSearch size={20} />} palette="slate" />
      <OverviewCard title="Butuh Tindakan" value={pending} icon={<AlertTriangle size={20} />} palette="amber" />
      <OverviewCard title="Sedang Proses" value={inProgress} icon={<Loader2 size={20} />} palette="blue" />
      <OverviewCard title="Selesai" value={completed} icon={<ShieldCheck size={20} />} palette="green" />
    </section>
  );
}
