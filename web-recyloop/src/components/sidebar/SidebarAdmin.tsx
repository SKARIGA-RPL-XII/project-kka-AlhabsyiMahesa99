"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Database, Truck, Users, BarChart3, Trophy, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function SidebarAdmin() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Data Master", href: "/admin/master", icon: Database }, // Kategori & Harga
    { name: "Manajemen Setoran", href: "/admin/setoran", icon: Truck }, // Verifikasi pickup
    { name: "Manajemen User", href: "/admin/users", icon: Users }, // User & Kurir
    { name: "Laporan", href: "/admin/laporan", icon: BarChart3 }, // Statistik
    { name: "Manajemen Reward", href: "/admin/reward", icon: Trophy }, // Tukar poin
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    document.cookie = "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="fixed left-0 top-0 flex h-screen w-64 flex-col bg-[#1E293B] text-white z-50">
      {/* Logo Area - Admin pakai warna agak beda biar gak ketuker */}
      <div className="flex h-20 items-center justify-center border-b border-slate-700">
        <h1 className="font-poppins text-2xl font-bold text-[#299E63]">Recyloop <span className="text-[10px] bg-[#299E63] text-white px-2 py-0.5 rounded ml-1">ADMIN</span></h1>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                isActive
                  ? "bg-[#299E63] text-white shadow-lg shadow-[#299E63]/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium text-sm font-poppins">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="flex w-full items-center space-x-3 rounded-xl px-4 py-3 text-red-400 transition-all hover:bg-red-500/10 cursor-pointer"
        >
          <LogOut size={20} />
          <span className="font-medium text-sm font-poppins">Log Out</span>
        </button>
      </div>
    </div>
  );
}