"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Recycle, AlertCircle, ChevronRight, Leaf, MapPin, Upload, X, MessageSquareText } from "lucide-react";
import { supabase } from "@/lib/supabase"; 

export default function SetorSampah() {
  const router = useRouter();

  const [categories, setCategories] = useState<any[]>([]);
  const [selectedKategori, setSelectedKategori] = useState("");
  const [berat, setBerat] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [alamat, setAlamat] = useState("Memuat alamat...");
  const [catatan, setCatatan] = useState("");
  const [editAlamat, setEditAlamat] = useState(false);
  const [loading, setLoading] = useState(false);

  // Ambil Kategori dari Database
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('waste_categories')
        .select('*')
        .order('name', { ascending: true });

      if (data) setCategories(data);
      if (error) console.error("Error fetching categories:", error.message);
    };

    fetchCategories();
  }, []);

  // Ambil alamat otomatis dari profil
  useEffect(() => {
    const fetchUserAddress = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('address')
          .eq('id', user.id)
          .single();

        if (data?.address) setAlamat(data.address);
        else setAlamat("Alamat belum diatur di profil");
      }
    };
    fetchUserAddress();
  }, []);

  const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeFoto = () => {
    setFoto(null);
    setPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foto || !selectedKategori || !berat) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User tidak ditemukan");

      // 1. Upload Foto
      const fileExt = foto.name.split(".").pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `waste-photos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("trash-images")
        .upload(filePath, foto);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("trash-images").getPublicUrl(filePath);

      // 2. Hitung Estimasi Poin
      const kategoriDetail = categories.find((c) => c.id === selectedKategori);
      const estimasiPoin = Math.floor(parseFloat(berat) * (kategoriDetail?.points_per_kg || 0));

      // 3. Insert ke Tabel Pickups (Sekarang dengan catatan)
      const { error: insertError } = await supabase.from("pickups").insert({
        user_id: user.id,
        waste_category_id: selectedKategori, 
        estimated_weight: parseFloat(berat), 
        pickup_address: alamat,
        notes: catatan, // Pastikan kolom 'notes' ada di tabel database Anda
        image_url: publicUrl,
        total_points_earned: estimasiPoin,
        status: "pending",
      });

      if (insertError) throw insertError;

      alert("Pengajuan berhasil dikirim!");
      router.refresh();
      // Reset State
      setSelectedKategori("");
      setBerat("");
      setFoto(null);
      setPreview(null);
      setCatatan("");
    } catch (error: any) {
      alert("Gagal mengirim: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-poppins">
      <div>
        <h1 className="text-3xl font-bold text-[#222D33]">Setor Sampah</h1>
        <p className="text-gray-500 mt-1">Ajukan penjemputan sampah dan pantau statusnya.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          
          {/* KATEGORI */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedKategori(item.id)}
                className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left cursor-pointer flex flex-col items-start ${
                  selectedKategori === item.id
                    ? "border-[#299E63] bg-[#299E63]/5 ring-2 ring-[#299E63]/20"
                    : "border-white bg-white hover:border-gray-200 shadow-sm"
                }`}
              >
                <div className="w-10 h-10 mb-2 relative">
                  <img 
                    src={item.image_url}
                    alt={item.name}
                    className={`w-full h-full object-contain transition-all duration-300 ${
                        selectedKategori === item.id ? "grayscale-0 scale-110" : "grayscale opacity-60"
                    }`}
                  />
                </div>
                <div className={`font-bold text-sm transition-colors ${selectedKategori === item.id ? "text-[#299E63]" : "text-gray-800"}`}>
                  {item.name}
                </div>
                <div className="text-[10px] text-gray-500 uppercase">{item.points_per_kg} pts/kg</div>
              </button>
            ))}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* BERAT */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Estimasi Berat (Kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={berat}
                  onChange={(e) => setBerat(e.target.value)}
                  placeholder="Contoh: 2.5"
                  className="text-black w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#299E63] outline-none"
                  required
                />
              </div>

              {/* FOTO */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Foto Sampah</label>
                {!preview ? (
                  <label className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-dashed border-gray-300 rounded-xl cursor-pointer text-sm text-[#299E63] hover:bg-gray-100 transition-colors">
                    <Upload size={18} />
                    Upload foto sampah
                    <input type="file" accept="image/*" onChange={handleFoto} hidden required />
                  </label>
                ) : (
                  <div className="relative w-32 h-32">
                    <img src={preview} alt="preview" className="w-full h-full object-cover rounded-xl border border-[#299E63]" />
                    <button
                      type="button"
                      onClick={removeFoto}
                      className="cursor-pointer absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* ALAMAT */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin size={16} /> Alamat Penjemputan
                  </label>
                  {!editAlamat ? (
                    <div className="flex justify-between items-start bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <p className="text-black text-sm leading-relaxed">{alamat}</p>
                      <button
                        type="button"
                        onClick={() => setEditAlamat(true)}
                        className="cursor-pointer text-xs text-[#299E63] font-bold hover:underline shrink-0 ml-2"
                      >
                        Ubah
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <textarea
                        value={alamat}
                        onChange={(e) => setAlamat(e.target.value)}
                        className="text-black w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#299E63] outline-none min-h-20"
                        placeholder="Masukkan alamat lengkap..."
                      />
                      <button 
                        type="button" 
                        onClick={() => setEditAlamat(false)}
                        className="text-xs font-bold text-gray-500"
                      >
                        Selesai Mengubah
                      </button>
                    </div>
                  )}
                </div>

                {/* KOLOM CATATAN (BARU) */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <MessageSquareText size={16} /> Catatan Tambahan (Opsional)
                  </label>
                  <textarea
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    placeholder="Contoh: Rumah warna biru, pagar hitam, atau sampah ada di depan teras."
                    className="text-black w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#299E63] outline-none min-h-20"
                  />
                </div>
              </div>

              <div className="bg-[#299E63]/10 p-4 rounded-xl flex items-start gap-3">
                <AlertCircle className="text-[#299E63] shrink-0" size={20} />
                <p className="text-xs text-[#299E63] leading-relaxed">
                  Pastikan sampah sudah dalam keadaan bersih dan dipilah sesuai kategori untuk mempermudah proses verifikasi.
                </p>
              </div>

              <button
                type="submit"
                disabled={!selectedKategori || !berat || !foto || loading}
                className="w-full py-4 bg-[#299E63] text-white rounded-xl font-bold shadow-lg shadow-[#299E63]/30 hover:bg-[#238b56] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                {loading ? "Memproses..." : "Ajukan Penjemputan"} <ChevronRight size={18} />
              </button>
              <button 
                type="button"
                onClick={() => router.back()}
                className="cursor-pointer w-full py-3 bg-white border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all text-sm"
              >
                Kembali
              </button>
            </form>
          </div>
        </div>

        {/* Kolom Kanan */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm">
              <Leaf size={16} className="text-[#299E63]" /> Cara Kerja
            </h3>
            <ul className="space-y-4">
              {["Pilih kategori sampah.", "Input estimasi berat.", "Kurir menjemput sesuai alamat & catatan."].map((text, i) => (
                <li key={i} className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#299E63] text-white text-[10px] flex items-center justify-center shrink-0 font-bold">{i+1}</span>
                  <p className="text-xs text-gray-600">{text}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-linear-to-br from-[#299E63] to-[#1f7a4d] p-6 rounded-2xl text-white shadow-xl shadow-[#299E63]/20 relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-lg font-bold mb-1">Estimasi Poin</h4>
              <p className="text-3xl font-bold">
                {selectedKategori && berat
                  ? (parseFloat(berat) * (categories.find((k) => k.id === selectedKategori)?.points_per_kg || 0)).toLocaleString()
                  : "0"}
                <span className="text-sm font-normal ml-2 opacity-80">pts</span>
              </p>
              <p className="text-[10px] mt-2 opacity-70 italic">*Poin akhir akan dikonfirmasi kurir</p>
            </div>
            <Recycle className="absolute -right-4 -bottom-4 opacity-10 w-32 h-32 rotate-12" />
          </div>
        </div>
      </div>
    </div>
  );
}