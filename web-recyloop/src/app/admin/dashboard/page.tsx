import React from "react";
import { 
  Users, 
  PackageCheck, 
  ArrowUpRight, 
  AlertCircle, 
  TrendingUp,
  Database,
  Trophy,
  BarChart3
} from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="font-poppins space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#222D33] font-poppins">Admin Overview</h1>
        <p className="text-gray-500">Monitor seluruh aktivitas Recyloop hari ini.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total User" value="1,284" icon={<Users />} color="blue" grow="+12%" />
        <StatCard title="Setoran Pending" value="24" icon={<AlertCircle />} color="orange" grow="Perlu Action" />
        <StatCard title="Total Sampah" value="5.4 Ton" icon={<PackageCheck />} color="green" grow="+5.2%" />
        <StatCard title="Poin Terpakai" value="850k" icon={<TrendingUp />} color="purple" grow="-2%" />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity (Manajemen Setoran Preview) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800">Setoran Terbaru</h3>
            <button className="text-[#299E63] text-sm font-semibold hover:underline">Lihat Semua</button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200 text-gray-400">#</div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">USR-092{i} - Budi Santoso</p>
                    <p className="text-xs text-gray-500">Plastik • 5.2 Kg</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-orange-100 text-orange-600 text-[10px] font-bold rounded-full">PENDING</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions (Data Master & Reward) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-6">Aksi Cepat</h3>
          <div className="space-y-3">
            <QuickActionButton label="Update Harga Sampah" icon={<Database size={18}/>} />
            <QuickActionButton label="Tambah Katalog Reward" icon={<Trophy size={18}/>} />
            <QuickActionButton label="Verifikasi Kurir Baru" icon={<Users size={18}/>} />
            <QuickActionButton label="Download Laporan Bulanan" icon={<BarChart3 size={18}/>} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-components untuk kerapihan
function StatCard({ title, value, icon, color, grow }: any) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    green: "bg-green-50 text-[#299E63]",
    purple: "bg-purple-50 text-purple-600",
  };
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colors[color]}`}>{icon}</div>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${grow.includes('-') ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
          {grow}
        </span>
      </div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <h2 className="text-2xl font-bold text-[#222D33] mt-1">{value}</h2>
    </div>
  );
}

function QuickActionButton({ label, icon }: any) {
  return (
    <button className="w-full flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all group">
      <div className="flex items-center gap-3 text-gray-600 group-hover:text-[#299E63]">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <ArrowUpRight size={16} className="text-gray-300" />
    </button>
  );
}