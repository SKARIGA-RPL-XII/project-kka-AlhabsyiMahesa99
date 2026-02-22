import { RecentPickupItem } from "../types/dashboard";

type Props = {
  loading: boolean;
  rows: RecentPickupItem[];
  onSeeAll: () => void;
};

function getStatusBadgeClass(status: string | null) {
  if (status === "completed") return "bg-green-100 text-green-700";
  if (status === "picked_up") return "bg-purple-100 text-purple-700";
  if (status === "scheduled") return "bg-blue-100 text-blue-700";
  if (status === "pending") return "bg-orange-100 text-orange-700";
  return "bg-gray-100 text-gray-700";
}

export function RecentPickupsCard({ loading, rows, onSeeAll }: Props) {
  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      {/* Recent Activity (Manajemen Setoran Preview) */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-800">Setoran Terbaru</h3>
        <button onClick={onSeeAll} className="cursor-pointer text-[#299E63] text-sm font-semibold hover:underline">
          Lihat Semua
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">Memuat data setoran...</div>
        ) : rows.length === 0 ? (
          <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">Belum ada data setoran terbaru.</div>
        ) : (
          rows.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200 text-gray-400">
                  #
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">
                    {item.displayId} - {item.customerName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.categoryName} - {item.weightKg.toLocaleString("id-ID")} Kg
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 text-[10px] font-bold rounded-full ${getStatusBadgeClass(item.status)}`}>
                {(item.status || "-").toUpperCase()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
