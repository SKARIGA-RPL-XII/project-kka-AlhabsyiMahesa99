import React from "react";
import { Mail, Phone, MapPin, Edit3, Wallet, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProfileActivity } from "../hooks/useUserProfile";

type ProfileData = {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  avatar_url: string;
  created_at: string;
  total_points: number;
};

type Props = {
  loading: boolean;
  profile: ProfileData;
  activities: ProfileActivity[];
  onEdit: () => void;
};

export default function ProfileView({ loading, profile, activities, onEdit }: Props) {
  const router = useRouter();

  const joinDate = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString("id-ID", { month: "short", year: "numeric" })
    : "Jan 2026";

  const formattedPoints = profile.total_points.toLocaleString("id-ID");

  return (
    <div className="space-y-8 font-poppins">
      {/* Header & Main Info */}
      <div className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-32 bg-linear-to-r from-[#299E63] to-[#1f7a4d]"></div>
        <div className="px-8 pb-8 text-black">
          <div className="relative flex flex-col md:flex-row md:items-end gap-6 -mt-12">
            <div className="w-32 h-32 rounded-4xl bg-white p-2 shadow-xl">
              <img
                src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.full_name}&background=299E63&color=fff`}
                alt="Avatar"
                className="w-full h-full object-cover rounded-3xl"
              />
            </div>
            <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-black">{profile.full_name}</h1>
                  <CheckCircle size={18} className="text-blue-500" />
                </div>
                <p className="text-gray-500 font-medium">Nasabah Member • Bergabung {joinDate}</p>
              </div>
              <button
                onClick={onEdit}
                className="cursor-pointer flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-2xl transition-all font-bold text-sm"
              >
                <Edit3 size={16} />
                Ubah Profil
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Kolom Kiri: Stats Singkat */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-[#299E63] p-6 rounded-[28px] text-white shadow-lg shadow-[#299E63]/20">
            <div className="flex items-center gap-3 mb-4 opacity-80">
              <Wallet size={20} />
              <span className="text-sm font-bold uppercase tracking-wider">Total Poin</span>
            </div>
            <div className="text-3xl font-bold">
              {loading ? "..." : formattedPoints} <span className="text-sm font-normal opacity-80">Poin</span>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-xs">
              <span>Setara Rp {loading ? "..." : formattedPoints}</span>
              <button
                onClick={() => router.push("/user/reward")}
                className="cursor-pointer inline-flex items-center gap-1 underline font-bold"
              >
                Tukar Reward <ArrowRight size={12} />
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm">
            <h4 className="text-black font-bold mb-4 flex items-center gap-2">
              <Clock size={18} className="text-[#299E63]" />
              Aktivitas Terakhir
            </h4>
            <div className="space-y-4">
              {loading ? (
                <p className="text-xs text-gray-400">Memuat aktivitas...</p>
              ) : activities.length === 0 ? (
                <p className="text-xs text-gray-400">Belum ada aktivitas setoran.</p>
              ) : (
                activities.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-1 bg-gray-100 rounded-full"></div>
                    <div>
                      <p className="text-xs font-bold text-black">{item.title}</p>
                      <p className="text-[10px] text-gray-400">{item.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Detail Data */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-black mb-6">Informasi Akun</h3>

            <div className="grid grid-cols-1 gap-6 text-black">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-transparent">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#299E63] shadow-sm">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Email</p>
                  <p className="text-sm font-bold">{profile.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-transparent">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#299E63] shadow-sm">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">WhatsApp</p>
                  <p className="text-sm font-bold">{profile.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-transparent">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#299E63] shadow-sm shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Alamat Penjemputan</p>
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
