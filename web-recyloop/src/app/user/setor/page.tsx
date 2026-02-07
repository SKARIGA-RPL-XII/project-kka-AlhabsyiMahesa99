"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Filter, Recycle, Clock, Package, Eye, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase"; 

export default function SetorSampah() {
  const router = useRouter();
  
  // State Management untuk data real dari DB] ---
  const [pickups, setPickups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, weight: 0, pending: 0 });

  // Helper format tanggal sesuai permintaan "24 Jan 2026"] ---
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Helper Format ID agar terlihat cantik "REC-XXXXX"] ---
  const formatId = (uuid: string) => {
    return `REC-${uuid.substring(0, 5).toUpperCase()}`;
  };

  // Fetch Data & Logic Stats Real-time] ---
  const fetchPickups = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data, error } = await supabase
        .from('pickups')
        .select(`
          *,
          waste_categories(name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) {
        setPickups(data);
        
        // Kalkulasi stats otomatis dari data yang ditarik
        const totalWeight = data.reduce((acc, curr) => acc + (curr.total_weight || curr.estimated_weight || 0), 0);
        const pendingCount = data.filter(p => p.status === 'pending').length;
        
        setStats({
          total: data.length,
          weight: totalWeight,
          pending: pendingCount
        });
      }
      if (error) console.error("Error fetching pickups:", error.message);
    }
    setLoading(false);
  };

  // Fungsi Hapus - Proteksi hanya status 'pending'] ---
  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Apakah kamu yakin ingin membatalkan setoran ini?");
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from('pickups')
        .delete()
        .eq('id', id)
        .eq('status', 'pending');

      if (error) throw error;
      
      alert("Setoran berhasil dibatalkan.");
      fetchPickups();
    } catch (error: any) {
      alert("Gagal menghapus: " + error.message);
    }
  };

  useEffect(() => {
    fetchPickups();
  }, []);

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

  return (
    <div className="font-poppins space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#222D33]">Data Setoran</h1>
          <p className="text-gray-500 mt-1">Pantau dan kelola riwayat setoran sampahmu.</p>
        </div>
        <button 
          onClick={() => router.push("/user/setor/tambah")}
          className="flex items-center justify-center gap-2 bg-[#299E63] hover:bg-[#238b56] text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-[#299E63]/20 cursor-pointer active:scale-95"
        >
          <Plus size={20} />
          Tambah Setoran
        </button>
      </div>

      {/* Stats Mini - [Data diambil dari state stats] */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-green-100 text-[#299E63] p-3 rounded-xl"><Package size={24} /></div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Setoran</p>
            <p className="text-xl font-bold text-[#222D33]">{stats.total} Kali</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-blue-100 text-blue-600 p-3 rounded-xl"><Recycle size={24} /></div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Berat Total</p>
            <p className="text-xl font-bold text-[#222D33]">{stats.weight.toFixed(1)} Kg</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-[#299E63]/20 text-[#299E63] p-3 rounded-xl"><Clock size={24} /></div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Menunggu</p>
            <p className="text-xl font-bold text-[#222D33]">{stats.pending} Request</p>
          </div>
        </div>
      </div>

      {/* Tabel Management */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between gap-4">
          <h3 className="font-bold text-[#222D33]">Riwayat Aktivitas</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Cari ID..." 
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#299E63]/20 focus:border-[#299E63] transition-all text-black"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 text-sm font-semibold transition-colors">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-10 text-center text-gray-400 animate-pulse">Memuat data transaksi...</div>
          ) : pickups.length === 0 ? (
            <div className="p-10 text-center text-gray-400 italic">Belum ada riwayat setoran.</div>
          ) : (
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
                {pickups.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      {/* [Tampilan ID & Tanggal Dinamis] */}
                      <div className="text-sm font-bold text-[#222D33]">{formatId(item.id)}</div>
                      <div className="text-[10px] text-gray-400 italic">{formatDate(item.created_at)}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                        {/* [Ambil data dari join table waste_categories] */}
                        {item.waste_categories?.name || "Kategori"}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-[#222D33]">
                        {/* [Berat menyesuaikan status] */}
                        {item.status === 'completed' ? item.total_weight : item.estimated_weight} Kg
                    </td>
                    <td className="px-6 py-4">
                        <span className="text-sm font-bold text-[#299E63]">+{item.total_points_earned || 0}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(item.status)}`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* [Navigasi Detail] */}
                        <button 
                          onClick={() => router.push(`/user/setor/detail/${item.id}`)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer" 
                          title="Detail"
                        >
                          <Eye size={18} />
                        </button>
                        
                        {/* [Tombol Hapus Kondisional (Hanya Pending)] */}
                        {item.status === 'pending' ? (
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" 
                            title="Batalkan Setoran"
                          >
                            <Trash2 size={18} />
                          </button>
                        ) : (
                          <span className="text-[10px] text-gray-300 font-medium italic select-none">Locked</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}