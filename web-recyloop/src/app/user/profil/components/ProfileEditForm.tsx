import React from "react";
import { User, Mail, Phone, MapPin, Camera, Save, Map, Building } from "lucide-react";
import { EditProfileFormData } from "../hooks/useEditProfile";

type Props = {
  loading: boolean;
  isLocating: boolean;
  formData: EditProfileFormData;
  previewUrl: string;
  onChangeFormData: (updater: EditProfileFormData) => void;
  onGetLocation: () => void;
  onSave: (e: React.FormEvent) => Promise<void>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function ProfileEditForm({
  loading,
  isLocating,
  formData,
  previewUrl,
  onChangeFormData,
  onGetLocation,
  onSave,
  onFileChange,
}: Props) {
  return (
    <div className="space-y-8 font-poppins">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#222D33]">Pengaturan Profil</h1>
        <p className="text-gray-500 mt-1">Lengkapi data diri dan alamat untuk memudahkan penjemputan sampah.</p>
      </div>

      <form onSubmit={onSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-black">
        {/* Kolom Kiri: Foto Profil */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gray-100 border-4 border-[#299E63]/20 overflow-hidden">
                <img
                  src={previewUrl || "https://ui-avatars.com/api/?name=User&background=299E63&color=fff"}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <label className="absolute bottom-0 right-0 bg-[#299E63] p-2 rounded-full text-white cursor-pointer shadow-lg hover:scale-110 transition-transform">
                <Camera size={18} />
                <input type="file" className="hidden" onChange={onFileChange} accept="image/*" />
              </label>
            </div>
            <h2 className="mt-4 font-bold text-lg text-black">{formData.full_name || "User Name"}</h2>
            <p className="text-sm text-gray-400">Nasabah Member</p>
          </div>
        </div>

        {/* Kolom Rerengat: Form Data */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-5">
            <h3 className="text-lg font-bold text-black border-l-4 border-[#299E63] pl-3">Data Pribadi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nama Lengkap</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Contoh: Rafi Putra"
                    value={formData.full_name}
                    onChange={(e) => onChangeFormData({ ...formData, full_name: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#299E63]/20 focus:border-[#299E63] outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nomor WhatsApp</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="0812xxxx"
                    value={formData.phone}
                    onChange={(e) => onChangeFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#299E63]/20 focus:border-[#299E63] outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  disabled
                  value={formData.email}
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 border border-transparent rounded-2xl text-gray-500 cursor-not-allowed outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-black border-l-4 border-[#299E63] pl-3">Alamat Penjemputan</h3>

              <button
                type="button"
                onClick={onGetLocation}
                disabled={isLocating}
                className="cursor-pointer text-[10px] font-black text-[#299E63] flex items-center gap-1.5 bg-[#299E63]/10 px-3 py-1.5 rounded-xl hover:bg-[#299E63]/20 transition-all active:scale-95"
              >
                <MapPin size={12} strokeWidth={3} className={isLocating ? "animate-bounce" : ""} />
                {isLocating ? "MENCARI..." : "GUNAKAN LOKASI SAAT INI"}
              </button>
            </div>

            <div className="space-y-2 mt-2">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Alamat Lengkap</label>

              <div className="relative">
                <MapPin className="absolute left-4 top-3 text-gray-400" size={18} />
                <textarea
                  rows={3}
                  value={formData.address}
                  onChange={(e) => onChangeFormData({ ...formData, address: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#299E63]/20 focus:border-[#299E63] outline-none transition-all"
                ></textarea>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Kecamatan</label>
                <div className="relative">
                  <Map className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => onChangeFormData({ ...formData, district: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#299E63]/20 focus:border-[#299E63] outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Kota / Kabupaten</label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => onChangeFormData({ ...formData, city: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#299E63]/20 focus:border-[#299E63] outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer flex items-center gap-2 bg-[#299E63] hover:bg-[#238b56] text-white font-bold px-10 py-4 rounded-2xl transition-all shadow-lg shadow-[#299E63]/20 active:scale-95 disabled:opacity-70"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save size={20} /> Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
