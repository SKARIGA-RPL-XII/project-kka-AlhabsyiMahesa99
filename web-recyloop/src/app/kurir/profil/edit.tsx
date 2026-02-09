"use client";
import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Camera, Save, Map, Building, Truck } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function CourierSettingProfile() {
  const [loading, setLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // State Form Data Kurir
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    address: '',
    district: '',
    city: '',
    latitude: null as number | null,
    longitude: null as number | null,
    avatar_url: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      if (data) {
        setFormData({
          full_name: data.full_name || '',
          phone: data.phone || '',
          email: user.email || '', 
          address: data.address || '',
          district: data.district || '',
          city: data.city || '',
          latitude: data.latitude,
          longitude: data.longitude,
          avatar_url: data.avatar_url || ''
        });
        setPreviewUrl(data.avatar_url || `https://ui-avatars.com/api/?name=${data.full_name}&background=2563eb&color=fff`);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const getLocation = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      alert("Browser tidak mendukung geolokasi");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        
        setFormData(prev => ({
          ...prev,
          latitude,
          longitude,
          address: data.display_name,
          district: data.address.suburb || data.address.village || data.address.municipality || '',
          city: data.address.city || data.address.regency || ''
        }));
      } catch (err) {
        console.error("Geocoding error:", err);
      } finally {
        setIsLocating(false);
      }
    }, () => {
      alert("Gagal mengambil lokasi. Pastikan GPS aktif.");
      setIsLocating(false);
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User tidak ditemukan");

      let currentAvatarUrl = formData.avatar_url;

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, selectedFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);
        
        currentAvatarUrl = publicUrl;
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          address: formData.address,
          district: formData.district,
          city: formData.city,
          latitude: formData.latitude,
          longitude: formData.longitude,
          avatar_url: currentAvatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) throw updateError;
      alert("Profil Kurir berhasil diperbarui!");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="space-y-8 font-poppins">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#222D33]">Pengaturan Profil</h1>
        <p className="text-gray-500 mt-1">
          Kelola informasi publik dan area operasional Anda.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-black"
      >
        {/* Kolom Kiri: Avatar */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gray-100 border-4 border-blue-100 overflow-hidden shadow-inner">
                <img
                  src={
                    previewUrl ||
                    `https://ui-avatars.com/api/?name=${formData.full_name}&background=2563eb&color=fff`
                  }
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white cursor-pointer shadow-lg hover:bg-blue-700 transition-all hover:scale-110 active:scale-95">
                <Camera size={18} />
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </label>
            </div>
            <h2 className="mt-4 font-bold text-lg text-black">
              {formData.full_name || "Partner Kurir"}
            </h2>
            <div className="mt-2 px-4 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider">
              Verified Partner
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Form Data */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-5">
            <h3 className="text-lg font-bold text-black border-l-4 border-blue-600 pl-3">
              Data Pribadi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Contoh: Budi Santoso"
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-50 focus:border-blue-600 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                  Nomor WhatsApp
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="0812xxxx"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-50 focus:border-blue-600 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
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
              <div className="text-lg font-bold text-blue-600 border-l-4 border-blue-600 pl-3">
                <h3 className="text-lg font-bold">Wilayah Operasional</h3>
              </div>
              <button
                type="button"
                onClick={getLocation}
                disabled={isLocating}
                className="cursor-pointer text-[10px] font-black text-blue-600 flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-all active:scale-95 disabled:opacity-50"
              >
                <MapPin
                  size={14}
                  className={isLocating ? "animate-ping" : ""}
                />
                {isLocating ? "MENGUNCI GPS..." : "UPDATE TITIK KOORDINAT"}
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                Alamat Domisili / Pangkalan
              </label>

              <div className="relative">
                <MapPin
                  className="absolute left-4 top-3 text-gray-400"
                  size={18}
                />
                <textarea
                  rows={3}
                  placeholder="Masukkan alamat lengkap Anda..."
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-50 focus:border-blue-600 outline-none transition-all"
                ></textarea>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                  Kecamatan
                </label>
                <div className="relative">
                  <Map
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) =>
                      setFormData({ ...formData, district: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-50 focus:border-blue-600 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                  Kota / Kabupaten
                </label>
                <div className="relative">
                  <Building
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-600 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-70"
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