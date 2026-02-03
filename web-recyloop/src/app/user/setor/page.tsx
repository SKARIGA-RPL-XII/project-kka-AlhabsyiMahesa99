"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Filter, Recycle, Clock, Package, Eye, Pencil, Trash2 } from "lucide-react";

// Data dummy disesuaikan dengan Enum Database
const MOCK_SETORAN = [
  { id: "REC-001", tanggal: "24 Jan 2026", kategori: "Plastik", berat: 2.5, poin: 1250, status: "completed" },
  { id: "REC-002", tanggal: "30 Jan 2026", kategori: "Kertas", berat: 5.0, poin: 1500, status: "scheduled" },
  { id: "REC-003", tanggal: "01 Feb 2026", kategori: "Elektronik", berat: 1.2, poin: 2400, status: "pending" },
  { id: "REC-004", tanggal: "02 Feb 2026", kategori: "Logam", berat: 3.0, poin: 2400, status: "cancelled" },
];

// Helper untuk styling status sesuai database
const getStatusStyle = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-700';
    case 'scheduled': return 'bg-blue-100 text-blue-700';
    case 'picked_up': return 'bg-purple-100 text-purple-700';
    case 'pending': return 'bg-orange-100 text-orange-700';
    case 'cancelled': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export default function SetorSampah() {
  const router = useRouter();

  return (
    <div className="font-poppins space-y-8">
      {/* Header & Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#222D33] font-poppins">Data Setoran</h1>
          <p className="text-gray-500 font-poppins mt-1">Pantau dan kelola riwayat setoran sampahmu.</p>
        </div>
        <button 
          onClick={() => router.push("/user/setor/tambah")}
          className="flex items-center justify-center gap-2 bg-[#299E63] hover:bg-[#238b56] text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-[#299E63]/20 cursor-pointer active:scale-95 font-poppins"
        >
          <Plus size={20} />
          Tambah Setoran
        </button>
      </div>

      {/* Stats Mini */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-green-100 text-[#299E63] p-3 rounded-xl"><Package size={24} /></div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Setoran</p>
            <p className="text-xl font-bold text-[#222D33]">12 Kali</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-blue-100 text-blue-600 p-3 rounded-xl"><Recycle size={24} /></div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Berat Total</p>
            <p className="text-xl font-bold text-[#222D33]">45.8 Kg</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-[#299E63]/20 text-[#299E63] p-3 rounded-xl"><Clock size={24} /></div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Menunggu</p>
            <p className="text-xl font-bold text-[#222D33]">1 Request</p>
          </div>
        </div>
      </div>

      {/* Tabel Management */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between gap-4">
          <h3 className="font-bold text-[#222D33] font-poppins">Riwayat Aktivitas</h3>
          
          <div className="flex items-center gap-3">
            {/* Search Area */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Cari ID..." 
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#299E63]/20 focus:border-[#299E63] transition-all text-black"
              />
            </div>
            {/* Filter Button */}
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 text-sm font-semibold transition-colors">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 text-gray-400 text-sm uppercase tracking-widest font-bold">
              <tr>
                <th className="px-6 py-4">ID & Tanggal</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Berat</th>
                <th className="px-6 py-4">Poin</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_SETORAN.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-[#222D33]">{item.id}</div>
                    <div className="text-[10px] text-gray-400 italic">{item.tanggal}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">{item.kategori}</td>
                  <td className="px-6 py-4 text-sm font-bold text-[#222D33]">{item.berat} Kg</td>
                  <td className="px-6 py-4"><span className="text-sm font-bold text-[#299E63]">+{item.poin}</span></td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(item.status)}`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Detail">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit">
                        <Pencil size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}