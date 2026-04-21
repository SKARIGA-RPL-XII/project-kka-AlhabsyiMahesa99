import { Award, CheckCircle, Edit3, Mail, MapPin, Package, Phone, Truck } from "lucide-react";
import { getProfileAvatarUrl } from "../../shared/utils/profileAvatar";

type Props = {
  loading: boolean;
  profile: {
    full_name: string;
    email: string;
    address: string;
    phone: string;
    avatar_url: string;
    total_pickups: number;
    total_weight: number;
  };
  joinDate: string;
  onEdit: () => void;
};

export function ProfileView({ loading, profile, joinDate, onEdit }: Props) {
  const averageWeight = profile.total_pickups > 0 ? `${(profile.total_weight / profile.total_pickups).toFixed(1)} Kg / pickup` : "Belum ada data";

  return (
    <div className="animate-in space-y-8 pb-10 font-poppins fade-in duration-500">
      <div className="overflow-hidden rounded-4xl border border-gray-100 bg-white shadow-sm">
        <div className="h-32 bg-linear-to-r from-blue-600 to-blue-800"></div>
        <div className="px-8 pb-8 text-black">
          <div className="-mt-12 flex flex-col gap-6 md:flex-row md:items-end">
            <div className="h-32 w-32 rounded-4xl bg-white p-2 shadow-xl">
              <img src={getProfileAvatarUrl(profile.full_name, profile.avatar_url)} alt="Avatar" className="h-full w-full rounded-3xl object-cover" />
            </div>
            <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-black">{profile.full_name}</h1>
                  <CheckCircle size={18} className="text-blue-500" />
                </div>
                <p className="font-medium text-gray-500">Partner Kurir • Bergabung {joinDate}</p>
              </div>
              <button
                onClick={onEdit}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gray-900 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-black hover:shadow-gray-200"
              >
                <Edit3 size={16} />
                Ubah Profil
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="space-y-6 md:col-span-1">
          <div className="rounded-[28px] bg-blue-600 p-6 text-white shadow-lg shadow-blue-600/20">
            <div className="mb-4 flex items-center gap-3 opacity-80">
              <Award size={20} />
              <span className="text-sm font-bold uppercase tracking-wider">Total Kontribusi</span>
            </div>
            <div className="text-3xl font-bold">
              {loading ? "..." : profile.total_weight} <span className="text-sm font-normal opacity-80">Kg Sampah</span>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-xs">
              <span>{loading ? "Memuat kontribusi..." : "Pahlawan Kebersihan"}</span>
              <Truck size={16} />
            </div>
          </div>

          <div className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm">
            <h4 className="mb-4 flex items-center gap-2 font-bold text-black">
              <Package size={18} className="text-blue-600" />
              Aktivitas Kurir
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-3">
                <span className="text-xs font-bold text-gray-500">Berhasil Pickup</span>
                <span className="text-sm font-bold text-black">{loading ? "..." : `${profile.total_pickups} Kali`}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-3">
                <span className="text-xs font-bold text-gray-500">Rata-rata Muatan</span>
                <span className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-bold text-blue-600">
                  {loading ? "Memuat..." : averageWeight}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 md:col-span-2">
          <div className="rounded-4xl border border-gray-100 bg-white p-8 shadow-sm">
            <h3 className="mb-6 text-lg font-bold text-black">Informasi Alamat & Kontak</h3>

            <div className="grid grid-cols-1 gap-6 text-black">
              <div className="flex items-center gap-4 rounded-2xl bg-gray-50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Kurir</p>
                  <p className="text-sm font-bold">{profile.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl bg-gray-50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">WhatsApp</p>
                  <p className="text-sm font-bold">{profile.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl bg-gray-50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Alamat Domisili / Pangkalan</p>
                  <p className="text-sm font-bold leading-relaxed">{profile.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
