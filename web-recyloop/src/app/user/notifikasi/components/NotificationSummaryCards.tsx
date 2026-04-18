type Props = {
  totalItems: number;
};

export function NotificationSummaryCards({ totalItems }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Notifikasi</p>
        <p className="mt-2 text-2xl font-bold">{totalItems}</p>
      </div>
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Status</p>
        <p className="mt-2 text-2xl font-bold text-[#299E63]">Selesai</p>
      </div>
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Periode</p>
        <p className="mt-2 text-2xl font-bold">Realtime</p>
      </div>
    </div>
  );
}
