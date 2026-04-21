import { Building, Camera, Mail, Map, MapPin, Phone, Save, User } from "lucide-react";
import { EditProfileFormData } from "../hooks/useEditProfile";

type Props = {
  loading: boolean;
  isLocating: boolean;
  formData: EditProfileFormData;
  previewUrl: string;
  onChangeFormData: (updater: EditProfileFormData) => void;
  onGetLocation: () => void;
  onSave: (event: React.FormEvent) => Promise<void>;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function ProfileEditForm({
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
        <p className="mt-1 text-gray-500">Kelola informasi publik dan area operasional Anda.</p>
      </div>

      <form onSubmit={onSave} className="grid grid-cols-1 gap-8 text-black lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="flex flex-col items-center rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm">
            <div className="group relative">
              <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-blue-100 bg-gray-100 shadow-inner">
                <img
                  src={previewUrl || `https://ui-avatars.com/api/?name=${formData.full_name}&background=2563eb&color=fff`}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              </div>
              <label className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-blue-600 p-2 text-white shadow-lg transition-all hover:scale-110 hover:bg-blue-700 active:scale-95">
                <Camera size={18} />
                <input type="file" className="hidden" onChange={onFileChange} accept="image/*" />
              </label>
            </div>
            <h2 className="mt-4 text-lg font-bold text-black">{formData.full_name || "Partner Kurir"}</h2>
            <div className="mt-2 rounded-full bg-blue-50 px-4 py-1 text-xs font-bold uppercase tracking-wider text-blue-600">
              Verified Partner
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="space-y-5 rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <h3 className="border-l-4 border-blue-600 pl-3 text-lg font-bold text-black">Data Pribadi</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="ml-1 text-xs font-bold uppercase text-gray-500">Nama Lengkap</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Contoh: Budi Santoso"
                    value={formData.full_name}
                    onChange={(event) => onChangeFormData({ ...formData, full_name: event.target.value })}
                    className="w-full rounded-2xl border border-transparent bg-gray-50 py-3 pl-12 pr-4 outline-none transition-all focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="ml-1 text-xs font-bold uppercase text-gray-500">Nomor WhatsApp</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="0812xxxx"
                    value={formData.phone}
                    onChange={(event) => onChangeFormData({ ...formData, phone: event.target.value })}
                    className="w-full rounded-2xl border border-transparent bg-gray-50 py-3 pl-12 pr-4 outline-none transition-all focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-50"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-xs font-bold uppercase text-gray-500">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  disabled
                  value={formData.email}
                  className="w-full cursor-not-allowed rounded-2xl border border-transparent bg-gray-100 py-3 pl-12 pr-4 text-gray-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-5 rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="border-l-4 border-blue-600 pl-3 text-lg font-bold text-blue-600">
                <h3 className="text-lg font-bold">Wilayah Operasional</h3>
              </div>
              <button
                type="button"
                onClick={onGetLocation}
                disabled={isLocating}
                className="flex cursor-pointer items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-[10px] font-black text-blue-600 transition-all hover:bg-blue-100 active:scale-95 disabled:opacity-50"
              >
                <MapPin size={14} className={isLocating ? "animate-ping" : ""} />
                {isLocating ? "MENGUNCI GPS..." : "UPDATE TITIK KOORDINAT"}
              </button>
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-xs font-bold uppercase text-gray-500">Alamat Domisili / Pangkalan</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3 text-gray-400" size={18} />
                <textarea
                  rows={3}
                  placeholder="Masukkan alamat lengkap Anda..."
                  value={formData.address}
                  onChange={(event) => onChangeFormData({ ...formData, address: event.target.value })}
                  className="w-full rounded-2xl border border-transparent bg-gray-50 py-3 pl-12 pr-4 outline-none transition-all focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-50"
                ></textarea>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="ml-1 text-xs font-bold uppercase text-gray-500">Kecamatan</label>
                <div className="relative">
                  <Map className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(event) => onChangeFormData({ ...formData, district: event.target.value })}
                    className="w-full rounded-2xl border border-transparent bg-gray-50 py-3 pl-12 pr-4 outline-none transition-all focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="ml-1 text-xs font-bold uppercase text-gray-500">Kota / Kabupaten</label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(event) => onChangeFormData({ ...formData, city: event.target.value })}
                    className="w-full rounded-2xl border border-transparent bg-gray-50 py-3 pl-12 pr-4 outline-none transition-all focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-50"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex cursor-pointer items-center gap-2 rounded-2xl bg-blue-600 px-10 py-4 font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-70"
            >
              {loading ? (
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
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
