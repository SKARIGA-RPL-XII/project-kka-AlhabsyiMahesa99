"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Truck, Scale, Coins, Calendar, Info,CheckCircle2,Clock,Package } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function DetailSetoran() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('pickups')
        .select(`
          *,
          waste_categories(name),
          profiles:user_id(full_name, phone)
        `)
        .eq('id', id)
        .single();

      if (data) setData(data);
      if (error) console.error(error);
      setLoading(false);
    };

    if (id) fetchDetail();
  }, [id]);

  if (loading) return <div className="p-10 text-center font-poppins">Loading detail...</div>;
  if (!data) return <div className="p-10 text-center font-poppins">Data tidak ditemukan.</div>;

  const steps = [
    { label: 'Pending', status: 'pending', icon: <Clock size={16} /> },
    { label: 'Dijadwalkan', status: 'scheduled', icon: <Calendar size={16} /> },
    { label: 'Diambil', status: 'picked_up', icon: <Truck size={16} /> },
    { label: 'Selesai', status: 'completed', icon: <CheckCircle2 size={16} /> },
  ];

  const currentStepIndex = steps.findIndex(s => s.status === data.status);

  return (
    <div className="font-poppins space-y-8">
      {/* Header & Back Button */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <ArrowLeft size={24} className="text-[#222D33]" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#222D33]">Detail Setoran</h1>
          <p className="text-sm text-gray-500 italic">ID: REC-{data.id.substring(0, 8).toUpperCase()}</p>
        </div>
      </div>

      {/* --- Progress Tracker --- */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center relative">
          {steps.map((step, index) => (
            <div key={step.status} className="flex flex-col items-center z-10 w-full">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                index <= currentStepIndex ? 'bg-[#299E63] text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                {step.icon}
              </div>
              <p className={`text-[10px] font-bold uppercase tracking-tighter ${
                index <= currentStepIndex ? 'text-[#299E63]' : 'text-gray-400'
              }`}>{step.label}</p>
            </div>
          ))}
          {/* Progress Line Background */}
          <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-100 z-0" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Info Utama */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-[#222D33] flex items-center gap-2">
              <Info size={18} className="text-[#299E63]" /> Informasi Sampah
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-[10px] text-gray-400 uppercase font-bold">Kategori</p>
                <p className="font-bold text-[#222D33]">{data.waste_categories?.name}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-[10px] text-gray-400 uppercase font-bold">Berat Final</p>
                <p className="font-bold text-[#222D33] text-lg">
                  {data.total_weight || data.estimated_weight} <span className="text-sm font-normal">Kg</span>
                </p>
              </div>
            </div>
            <div className="p-4 border border-dashed border-gray-200 rounded-xl">
              <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Catatan User</p>
              <p className="text-sm text-gray-600 italic">"{data.notes || 'Tidak ada catatan'}"</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-[#222D33] flex items-center gap-2">
              <MapPin size={18} className="text-[#299E63]" /> Lokasi Penjemputan
            </h3>
            <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl leading-relaxed">
              {data.pickup_address || "Alamat tidak tersedia"}
            </div>
          </div>
        </div>

        {/* Sidebar: Poin & Kurir */}
        <div className="space-y-6">
          <div className="bg-[#299E63] p-6 rounded-2xl text-white shadow-lg shadow-[#299E63]/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 p-2 rounded-lg"><Coins size={20} /></div>
              <p className="font-bold">Total Poin</p>
            </div>
            <p className="text-4xl font-black mb-1">+{data.total_points_earned || 0}</p>
            <p className="text-xs text-white/80">Poin otomatis masuk ke saldo setelah status Selesai.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-[#222D33] flex items-center gap-2">
              <Truck size={18} className="text-blue-500" /> Info Kurir
            </h3>
            {data.courier_id ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                  K
                </div>
                <div>
                  <p className="text-sm font-bold text-[#222D33]">Driver Recycle</p>
                  <p className="text-[10px] text-gray-400">Sedang bertugas</p>
                </div>
              </div>
            ) : (
              <div className="text-xs text-gray-400 italic bg-gray-50 p-3 rounded-lg text-center">
                Kurir belum ditugaskan
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}