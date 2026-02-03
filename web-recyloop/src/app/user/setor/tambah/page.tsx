"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Recycle, Scale, AlertCircle, ChevronRight, Leaf, Package, FileText, Cpu, MapPin, Upload } from "lucide-react";

const KATEGORI_SAMPAH = [
  { id: "plastik", name: "Plastik", icon: Recycle, point: 500, desc: "Botol, kemasan, ember" },
  { id: "kertas", name: "Kertas", icon: FileText, point: 300, desc: "Kardus, koran, buku" },
  { id: "logam", name: "Logam", icon: Package, point: 800, desc: "Kaleng, besi, aluminium" },
  { id: "elektronik", name: "Elektronik", icon: Cpu, point: 2000, desc: "Kabel, baterai, HP" },
];

export default function SetorSampah() {
  const router = useRouter();

  const [selectedKategori, setSelectedKategori] = useState("");
  const [berat, setBerat] = useState("");

  // 🔹 FOTO
  const [foto, setFoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // 🔹 ALAMAT
  const [alamat, setAlamat] = useState(
    "Jl. Mawar No. 12, Jakarta Selatan"
  );
  const [editAlamat, setEditAlamat] = useState(false);

  const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foto) return;

    alert("Pengajuan berhasil! Status: Pending");

    // reset
    setSelectedKategori("");
    setBerat("");
    setFoto(null);
    setPreview(null);
  };

  return (
    <div className="space-y-8 font-poppins">
      {/* Header Halaman */}
      <div>
        <h1 className="text-3xl font-bold text-[#222D33] font-poppins">
          Setor Sampah
        </h1>
        <p className="text-gray-500 font-poppins mt-1">
          Ajukan penjemputan sampah dan pantau statusnya.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri */}
        <div className="lg:col-span-2 space-y-6">
          {/* KATEGORI */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {KATEGORI_SAMPAH.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedKategori(item.id)}
                className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                  selectedKategori === item.id
                    ? "border-[#299E63] bg-[#299E63]/5 ring-2 ring-[#299E63]/20"
                    : "border-white bg-white hover:border-gray-200 shadow-sm"
                }`}
              >
                <item.icon
                  size={28}
                  className={
                    selectedKategori === item.id
                      ? "text-[#299E63]"
                      : "text-gray-500"
                  }
                />
                <div className="font-redhat-display font-bold text-gray-800 mt-2">{item.name}</div>
                <div className="font-redhat-text text-[10px] text-gray-500 uppercase">
                  {item.point} pts/kg
                </div>
              </button>
            ))}
          </div>

          {/* FORM */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* BERAT */}
              <div>
                <label className="block text-sm font-semibold font-redhat-display text-gray-700 mb-2">
                  Estimasi Berat (Kg)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={berat}
                    onChange={(e) => setBerat(e.target.value)}
                    placeholder="Contoh: 2.5"
                    className="font-redhat-text text-black w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#299E63]"
                    required
                  />
                </div>
              </div>

              {/* UPLOAD FOTO */}
              <div>
                <label className="font-redhat-display block text-sm font-semibold text-gray-700 mb-2">
                  Foto Sampah
                </label>
                <label className="font-redhat-text flex items-center gap-3 px-4 py-3 bg-gray-50 border border-dashed rounded-xl cursor-pointer text-sm text-[#299E63]">
                  <Upload size={18} />
                  Upload foto sampah
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFoto}
                    hidden
                    required
                  />
                </label>

                {preview && (
                  <img
                    src={preview}
                    alt="preview"
                    className="mt-3 w-32 h-32 object-cover rounded-xl border"
                  />
                )}
              </div>

              {/* ALAMAT */}
              <div>
                <label className="font-redhat-display text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin size={16} /> Alamat Penjemputan
                </label>

                {!editAlamat ? (
                  <div className="flex justify-between items-start bg-gray-50 p-4 rounded-xl border">
                    <p className="font-redhat-text text-black text-sm ">{alamat}</p>
                    <button
                      type="button"
                      onClick={() => setEditAlamat(true)}
                      className="text-xs text-[#299E63] font-semibold"
                    >
                      Ubah
                    </button>
                  </div>
                ) : (
                  <textarea
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    className="text-black w-full p-3 border rounded-xl text-sm"
                  />
                )}
              </div>

              {/* ALERT */}
              <div className="bg-[#299E63]/10 p-4 rounded-xl flex items-start gap-3">
                <AlertCircle className="text-[#299E63]" size={20} />
                <p className="font-poppins text-xs text-[#299E63] leading-relaxed">
                  Pastikan sampah sudah dalam keadaan bersih dan dipilah sesuai
                  kategori untuk mempermudah proses verifikasi oleh kurir kami.
                </p>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={!selectedKategori || !berat || !foto}
                className="w-full py-4 bg-[#299E63] font-poppins text-white rounded-xl font-bold shadow-lg shadow-[#299E63]/30 hover:bg-[#238b56] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                Ajukan Penjemputan <ChevronRight size={18} />
              </button>

              {/* Kembali */}
              <button 
              onClick={() => router.push("/user/setor")}
              className="bg-white border-2 border-gray-300 font-poppins text-black font-semibold px-4 py-2 rounded-md cursor-pointer"
              >
                Kembali
              </button>
            </form>
          </div>
        </div>

        {/* Kolom Kanan */}
        <div className="space-y-6">
          {/* CARA KERJA */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm">
              <Leaf size={16} className="text-[#299E63]" /> Cara Kerja
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-[#299E63] text-white text-[10px] flex items-center justify-center shrink-0">
                  1
                </span>
                <p className="text-xs text-gray-600 font-poppins">
                  Pilih kategori sampah yang ingin kamu setor.
                </p>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-[#299E63] text-white text-[10px] flex items-center justify-center shrink-0">
                  2
                </span>
                <p className="text-xs text-gray-600 font-poppins">
                  Input estimasi berat, timbangan final dilakukan oleh kurir.
                </p>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-[#299E63] text-white text-[10px] flex items-center justify-center shrink-0">
                  3
                </span>
                <p className="text-xs text-gray-600 font-poppins">
                  Kurir akan datang menjemput ke alamatmu.
                </p>
              </li>
            </ul>
          </div>

          {/* TOTAL POIN */}
          <div className="bg-linear-to-br from-[#299E63] to-[#1f7a4d] p-6 rounded-2xl text-white shadow-xl shadow-[#299E63]/20 relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-lg font-bold mb-1">Total Poin</h4>
              <p className="text-3xl font-bold">
                {selectedKategori && berat
                  ? (
                      parseFloat(berat) *
                      KATEGORI_SAMPAH.find((k) => k.id === selectedKategori)!
                        .point
                    ).toLocaleString()
                  : "0"}
                <span className="text-sm font-normal ml-2 opacity-80">pts</span>
              </p>
              <p className="text-[10px] mt-2 opacity-70 italic">
                *Estimasi poin yang akan didapatkan
              </p>
            </div>
            <Recycle className="absolute -right-4 -bottom-4 opacity-10 w-32 h-32 rotate-12" />
          </div>
          
        </div>
      </div>
    </div>
  );
}