"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Truck, Package, CheckCircle, Scale, Loader2 } from 'lucide-react';
import { supabase } from "@/lib/supabase";

export default function CourierDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState({
    available: 0,
    onGoing: 0,
    completedToday: 0,
    totalWeight: 0
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Ambil Tugas Tersedia (status: 'pending')
      const { count: availableCount } = await supabase
        .from("pickups")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      // 2. Ambil Sedang Dijemput (status: 'scheduled' milik kurir ini)
      const { count: onGoingCount } = await supabase
        .from("pickups")
        .select("*", { count: "exact", head: true })
        .eq("kurir_id", user.id)
        .eq("status", "scheduled");

      // 3. Ambil Selesai Hari Ini & Total Berat (status: 'picked_up' atau 'completed' hari ini)
      const now = new Date();
      const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      ).toISOString();

      // 4. Query data
      const { data: finishedData, error } = await supabase
        .from("pickups")
        .select("total_weight")
        .eq("kurir_id", user.id)
        // Kita ganti status filter supaya 'picked_up' juga kehitung
        .in("status", ["picked_up", "completed"])
        // Pakai 'created_at' karena kolom 'updated_at' nggak ada di tabel lu
        .gte("created_at", startOfToday);

      if (error) console.error("Error dashboard:", error);

      const totalWeight =
        finishedData?.reduce(
          (acc, curr) => acc + (curr.total_weight || 0),
          0,
        ) || 0;

      setStatsData({
        available: availableCount || 0,
        onGoing: onGoingCount || 0,
        completedToday: finishedData?.length || 0, // Ini akan ngitung berapa baris yang picked_up/completed hari ini
        totalWeight: totalWeight,
      });
      setLoading(false);
    };

    fetchDashboardStats();
  }, []);

  const stats = [
    {
      label: "Tugas Tersedia",
      value: statsData.available.toString(),
      icon: Package,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Sedang Dijemput",
      value: statsData.onGoing.toString(),
      icon: Truck,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      label: "Selesai Hari Ini",
      value: statsData.completedToday.toString(),
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Total Berat (Kg)",
      value: statsData.totalWeight.toFixed(1),
      icon: Scale,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="font-poppins space-y-8">
      {/* Header */}
      <div className="mb-8 text-left">
        <h1 className="text-3xl font-bold font-poppins text-gray-800">
          Halo, Kurir Recyloop!
        </h1>
        <p className="text-gray-500 mt-2">
          Semangat jemput sampah dan selamatkan bumi hari ini.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-800">
                {stat.value}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Action / Status Center */}
      <div className="bg-blue-600 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <h2 className="text-xl font-bold mb-1">Siap Bekerja?</h2>
          <p className="opacity-90">
            Aktifkan statusmu untuk mulai menerima pesanan jemputan.
          </p>
        </div>
        <button
          onClick={() => router.push("/kurir/pickup-list")}
          className="cursor-pointer bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition-colors shadow-lg"
        >
          Mulai Terima Tugas
        </button>
      </div>
    </div>
  );
}