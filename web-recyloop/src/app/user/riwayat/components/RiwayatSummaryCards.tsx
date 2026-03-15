type Props = {
  summary: {
    total: number;
    inProgress: number;
    done: number;
  };
};

export function RiwayatSummaryCards({ summary }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* Summary Cards */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Request</p>
        <p className="mt-2 text-2xl font-bold">{summary.total}</p>
      </div>
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Sedang Berjalan</p>
        <p className="mt-2 text-2xl font-bold text-blue-700">{summary.inProgress}</p>
      </div>
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Selesai</p>
        <p className="mt-2 text-2xl font-bold text-[#299E63]">{summary.done}</p>
      </div>
    </div>
  );
}
