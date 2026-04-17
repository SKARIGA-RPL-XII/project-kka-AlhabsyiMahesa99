import { Recycle } from "lucide-react";
import { DashboardActivityItem } from "../types/dashboard";

type Props = {
  loading: boolean;
  rows: DashboardActivityItem[];
  onGoRiwayat: () => void;
};

export default function DashboardRecentActivities({ loading, rows, onGoRiwayat }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      {/* Riwayat Terakhir */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-[#222D33] font-poppins">Aktivitas Terakhir</h3>
        <button onClick={onGoRiwayat} className="text-sm text-[#299E63] font-semibold hover:underline font-poppins cursor-pointer">
          Lihat Semua
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="p-4 text-sm text-gray-400 font-poppins">Memuat aktivitas terbaru...</div>
        ) : rows.length === 0 ? (
          <div className="p-4 text-sm italic text-gray-500 font-poppins">Belum ada aktivitas setoran.</div>
        ) : (
          rows.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition border border-transparent hover:border-gray-100"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-gray-100 p-2 rounded-lg text-gray-600">
                  <Recycle size={20} />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm font-poppins">{item.title}</p>
                  <p className="text-[10px] text-gray-400 font-poppins italic">{item.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-[#299E63] text-sm font-poppins">{item.pointsText}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-poppins ${item.statusClass}`}>{item.statusText}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
