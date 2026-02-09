"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { MapPin, Weight, Calendar, ArrowRight, Package, StickyNote } from "lucide-react";

export default function PickupList() {
  const router = useRouter();
  const [pickups, setPickups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPickups = async () => {
      // Kita join dengan tabel profiles untuk ambil full_name
      const { data, error } = await supabase
        .from("pickups")
        .select(`
          *,
          profiles:user_id (full_name)
        `)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (!error) {
        setPickups(data);
      } else {
        console.error("Error fetching:", error);
      }
      setLoading(false);
    };

    fetchPickups();
  }, []);

  // Fungsi format tanggal jadi "6 Feb 2026"
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(dateString));
  };

  const handleAmbilTugas = async (pickupId: string) => {
    try {
      // 1. Ambil data session user yang login (Kurir)
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert("Waduh, lu harus login dulu bro!");
        return;
      }

      // 2. Update status di database
      const { error } = await supabase
        .from("pickups")
        .update({ 
          status: "scheduled", // Sesuai enum di gambar lu
          kurir_id: user.id    // Catat siapa kurir yang ngambil
        })
        .eq("id", pickupId)
        .eq("status", "pending"); // Guard agar tidak terambil 2x oleh kurir berbeda secara bersamaan

      if (error) throw error;

      alert("Tugas berhasil diambil! Gas ke lokasi, Bro.");
      
      // 3. Pindah ke halaman tugas aktif
      router.push("/kurir/active-task"); 

    } catch (error: any) {
      console.error("Gagal ambil tugas:", error.message);
      alert("Gagal ambil tugas. Mungkin sudah diambil kurir lain.");
    }
  };

  if (loading) return <div className="p-8 text-center font-poppins">Memuat daftar sampah...</div>;

  return (
    <div className="font-poppins space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Daftar Jemputan</h1>
        <p className="text-gray-500">Pilih tugas yang ingin kamu kerjakan sekarang.</p>
      </div>

      {pickups.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <Package size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">Belum ada permintaan jemputan saat ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pickups.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all group flex flex-col"
            >
              {/* Foto Sampah */}
              <div className="relative h-48 w-full bg-gray-100">
                {item.image_url ? (
                  <img 
                    src={item.image_url} 
                    alt="Sampah" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <Package size={32} />
                    <span className="text-xs mt-2">Tanpa Foto</span>
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                    ID: {item.id.slice(0, 5)}
                  </span>
                </div>
              </div>

              {/* Konten Card */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                  <h3 className="font-bold text-xl text-gray-800 capitalize">
                    {item.profiles?.full_name || "Anonim"}
                  </h3>
                  <div className="flex items-start text-gray-500 text-sm mt-2">
                    <MapPin size={16} className="mr-2 text-red-500 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{item.pickup_address || "Alamat tidak tersedia"}</span>
                  </div>
                </div>

                {/* Info Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-blue-50/50 p-3 rounded-2xl border border-blue-100">
                    <div className="flex items-center text-blue-400 text-sm uppercase font-bold mb-1">
                      <Weight size={12} className="mr-1" /> Est. Berat
                    </div>
                    <p className="font-bold text-blue-700">{item.estimated_weight} Kg</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                    <div className="flex items-center text-gray-400 text-sm uppercase font-bold mb-1">
                      <Calendar size={12} className="mr-1" /> Tanggal
                    </div>
                    <p className="font-bold text-gray-700 text-sm">
                        {formatDate(item.created_at)}
                    </p>
                  </div>
                </div>

                {/* Bagian Catatan (Notes) */}
                <div className="mb-6 flex-1">
                  <div className="flex items-center text-gray-400 text-[10px] uppercase font-bold mb-1">
                    <StickyNote size={12} className="mr-1" /> Catatan User
                  </div>
                  <p className="text-sm text-gray-600 italic">
                    "{item.notes || "Tidak ada catatan khusus"}"
                  </p>
                </div>

                <button 
                  onClick={() => handleAmbilTugas(item.id)}
                  className="cursor-pointer w-full bg-gray-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center group-hover:bg-blue-600 transition-all active:scale-95"
                >
                  Ambil Tugas <ArrowRight size={18} className="ml-2" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}