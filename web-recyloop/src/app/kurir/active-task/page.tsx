"use client";
import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { MapPin, Phone, Navigation, Package, Info, Camera, Scale, ChevronRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ActiveTask() {
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [finalWeight, setFinalWeight] = useState("");
  const [issubmitting, setIsSubmitting] = useState(false);
  
  // State Baru buat Image
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchActiveTask = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("pickups")
          .select(`*, profiles:user_id (full_name, phone)`)
          .eq("kurir_id", user.id)
          .eq("status", "scheduled") 
          .single();
        if (!error) setTask(data);
      }
      setLoading(false);
    };
    fetchActiveTask();
  }, []);

  // Fungsi pilih gambar
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleValidationAndPickUp = async () => {
    if (!finalWeight || parseFloat(finalWeight) <= 0) {
      alert("Masukkan berat sampah dulu, Bro!");
      return;
    }
    if (!imageFile) {
      alert("Foto bukti timbangan wajib ada!");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 1. Upload ke Storage
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${task.id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('pickup-photos')
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      // 2. Dapetin URL-nya
      const { data: { publicUrl } } = supabase.storage
        .from('pickup-photos')
        .getPublicUrl(fileName);

      // 3. Update DB
      const { error: updateError } = await supabase
        .from("pickups")
        .update({ 
          status: "picked_up",
          total_weight: parseFloat(finalWeight),
          pickup_image_url: publicUrl 
        })
        .eq("id", task.id);

      if (updateError) throw updateError;

      alert("Mantap! Data terkirim, lanjut setor ke gudang!");
      router.push("/kurir/dashboard"); 

    } catch (err: any) {
      alert("Waduh gagal: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="text-black p-8 text-center font-poppins">Mencari tugas aktif...</div>;

  if (!task) return (
    <div className="flex flex-col items-center justify-center h-[70vh] font-poppins px-6 text-center">
      <div className="bg-gray-100 p-6 rounded-full mb-4"><Package size={48} className="text-gray-400" /></div>
      <h2 className="text-xl font-bold text-gray-800">Tidak ada tugas aktif</h2>
      <p className="text-gray-500 mt-2">Cek daftar jemputan dulu, Bro!</p>
    </div>
  );

  return (
    <div className="font-poppins p-4 md:p-8 max-w-2xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Validasi Jemputan</h1>
        <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-xs font-bold uppercase">{task.status}</span>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden mb-6">
        <div className="bg-blue-600 p-6 text-white">
          <p className="text-blue-100 text-[10px] uppercase font-bold tracking-widest mb-1">Pelanggan</p>
          <h2 className="text-2xl font-bold">{task.profiles?.full_name}</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-start">
            <div className="bg-red-50 p-3 rounded-2xl mr-4"><MapPin className="text-red-500" size={20} /></div>
            <div className="flex-1">
              <p className="text-gray-400 text-[10px] font-bold uppercase">Alamat</p>
              <p className="text-gray-700 font-medium text-sm">{task.pickup_address}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <a href={`tel:${task.profiles?.phone}`} className="flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 rounded-2xl font-bold text-sm border border-gray-100">
              <Phone size={18} className="mr-2 text-green-500" /> Hubungi
            </a>
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(task.pickup_address)}`} target="_blank" className="flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 rounded-2xl font-bold text-sm border border-gray-100">
              <Navigation size={18} className="mr-2 text-blue-500" /> Maps
            </a>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 rounded-3xl p-6 text-white shadow-2xl space-y-6">
        <div className="flex items-center space-x-2 mb-2">
          <Scale size={20} className="text-blue-400" />
          <h3 className="font-bold text-lg">Input Hasil Timbangan</h3>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input 
              type="number" step="0.1" value={finalWeight}
              onChange={(e) => setFinalWeight(e.target.value)}
              placeholder="0.0"
              className="w-full bg-gray-800 border-none rounded-2xl p-5 text-3xl font-bold text-white focus:ring-2 focus:ring-blue-500 placeholder:text-gray-700"
            />
          </div>

          {/* Input File Hidden */}
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
          
          {/* Box Foto yang Lu Suka (Sekarang Bisa Diklik) */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="bg-gray-800 border-2 border-dashed border-gray-700 rounded-2xl p-6 flex flex-col items-center justify-center group cursor-pointer hover:border-blue-500 transition-all overflow-hidden"
          >
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="w-full h-40 object-cover rounded-xl" />
            ) : (
              <>
                <div className="bg-gray-700 p-3 rounded-full mb-2 group-hover:bg-blue-600 transition-all">
                  <Camera size={24} />
                </div>
                <p className="text-xs font-bold text-gray-400">AMBIL FOTO SAMPAH</p>
              </>
            )}
          </div>
        </div>

        <button 
          onClick={handleValidationAndPickUp}
          disabled={issubmitting}
          className="cursor-pointer w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-bold text-lg shadow-lg transition-all flex items-center justify-center active:scale-95 disabled:bg-gray-700"
        >
          {issubmitting ? <Loader2 className="animate-spin mr-2" /> : "Konfirmasi & Pick Up"}
          {!issubmitting && <ChevronRight className="ml-2" />}
        </button>
      </div>

      <div className="mt-8 bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start">
        <Info className="text-amber-500 mr-3 shrink-0" size={20} />
        <p className="text-xs text-amber-700 leading-relaxed">Pastikan berat sesuai timbangan. Data divalidasi ulang oleh Admin gudang.</p>
      </div>
    </div>
  );
}