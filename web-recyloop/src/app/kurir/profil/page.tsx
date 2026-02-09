"use client";
import React, { useState, useEffect } from "react";
import { 
  User, Mail, Phone, Truck, CheckCircle, 
  Edit3, Package, Calendar, MapPin, Award, ArrowLeft 
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import SettingProfil from "./edit"; // Pastikan path file edit.tsx sudah benar

export default function CourierProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    full_name: "Memuat...",
    email: "...",
    address: "Alamat belum diatur",
    phone: "-",
    avatar_url: "",
    created_at: "",
    total_pickups: 0,
    total_weight: 0
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      // 1. Ambil Session User
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 2. Ambil data detail dari tabel Profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // 3. Hitung total pickup & berat dari tabel pickups (Status: completed)
      const { data: stats, error: statsError } = await supabase
        .from('pickups')
        .select('weight')
        .eq('kurir_id', user.id)
        .eq('status', 'completed');

      const totalKg = stats?.reduce((acc, curr) => acc + (curr.weight || 0), 0) || 0;

      if (profileData) {
        setProfile({
          full_name: profileData.full_name || "Kurir Recyloop",
          email: user.email || "",
          address: profileData.address || "Alamat belum diatur",
          phone: profileData.phone || "-",
          avatar_url: profileData.avatar_url || "",
          created_at: profileData.created_at || user.created_at,
          total_pickups: stats?.length || 0,
          total_weight: totalKg
        });
      }
    } catch (error) {
      console.error("Error fetching courier profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // Jalankan fetch saat pertama kali load atau saat selesai editing
  useEffect(() => {
    fetchProfile();
  }, [isEditing]);

  const joinDate = profile.created_at 
    ? new Date(profile.created_at).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
    : "Feb 2026";

  // Tampilan Loading
  if (loading && !isEditing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 font-poppins">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500">Memuat profil pahlawan kebersihan...</p>
      </div>
    );
  }

  // Tampilan Mode Edit (SettingProfil)
  if (isEditing) {
    return (
      <div className="space-y-6 font-poppins">
        <button 
          onClick={() => setIsEditing(false)}
          className="cursor-pointer text-sm font-bold text-gray-500 hover:text-blue-600 flex items-center gap-2 transition-colors"
        >
          <ArrowLeft size={16} />
          Kembali ke Profil
        </button>
        <SettingProfil /> 
      </div>
    );
  }

  return (
    <div className="space-y-8 font-poppins pb-10 animate-in fade-in duration-500">
      {/* Header & Main Info */}
      <div className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-32 bg-linear-to-r from-blue-600 to-blue-800"></div>
        <div className="px-8 pb-8 text-black">
          <div className="relative flex flex-col md:flex-row md:items-end gap-6 -mt-12">
            <div className="w-32 h-32 rounded-4xl bg-white p-2 shadow-xl">
              <img 
                src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.full_name}&background=2563eb&color=fff`} 
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
                <p className="text-gray-500 font-medium">Partner Kurir • Bergabung {joinDate}</p>
              </div>
              <button 
                onClick={() => setIsEditing(true)}
                className="cursor-pointer flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-2xl transition-all font-bold text-sm shadow-lg hover:shadow-gray-200"
              >
                <Edit3 size={16} />
                Ubah Profil
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Kolom Kiri: Stats Kontribusi */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-blue-600 p-6 rounded-[28px] text-white shadow-lg shadow-blue-600/20">
            <div className="flex items-center gap-3 mb-4 opacity-80">
              <Award size={20} />
              <span className="text-sm font-bold uppercase tracking-wider">Total Kontribusi</span>
            </div>
            <div className="text-3xl font-bold">{profile.total_weight} <span className="text-sm font-normal opacity-80">Kg Sampah</span></div>
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-xs">
              <span>Pahlawan Kebersihan</span>
              <Truck size={16} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm">
            <h4 className="text-black font-bold mb-4 flex items-center gap-2">
              <Package size={18} className="text-blue-600" />
              Aktivitas Kurir
            </h4>
            <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl">
                    <span className="text-xs text-gray-500 font-bold">Berhasil Pickup</span>
                    <span className="text-sm font-bold text-black">{profile.total_pickups} Kali</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl">
                    <span className="text-xs text-gray-500 font-bold">Status Kerja</span>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">Siap Angkut</span>
                </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Detail Data */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-black mb-6">Informasi Kendaraan & Kontak</h3>
            
            <div className="grid grid-cols-1 gap-6 text-black">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-transparent">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Email Kurir</p>
                  <p className="text-sm font-bold">{profile.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-transparent">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">WhatsApp</p>
                  <p className="text-sm font-bold">{profile.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-transparent">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Alamat Domisili / Pangkalan</p>
                  <p className="text-sm font-bold leading-relaxed">
                    {profile.address}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}