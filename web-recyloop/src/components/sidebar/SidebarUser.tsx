"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Recycle, 
  History, 
  Gift, 
  UserCircle, 
  LogOut,
  Bell 
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function SidebarUser() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: "Dashboard", href: "/user/dashboard", icon: LayoutDashboard },
    { name: "Setor Sampah", href: "/user/setor", icon: Recycle },
    { name: "Riwayat", href: "/user/riwayat", icon: History },
    { name: "Notifikasi", href: "/user/notifikasi", icon: Bell },
    { name: "Tukar Poin", href: "/user/reward", icon: Gift },
    { name: "Profil", href: "/user/profil", icon: UserCircle },
  ];

  const handleLogout = async () => {
    // 1. Sign out dari Supabase (Hapus LocalStorage)
    await supabase.auth.signOut();

    // 2. Hapus Cookies secara manual dengan set Expired ke masa lalu
    document.cookie = "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
    document.cookie = "sb-refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
    document.cookie = "user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";

    // 3. Lempar ke halaman login
    // Pastikan path-nya benar, kalau folder kamu (auth)/login, biasanya routenya /login
    router.push("/login"); 
    router.refresh(); // Paksa refresh biar middleware ngecek ulang kondisi kosongan
  };

  return (
    // Tambah fixed, h-screen, dan z-index agar tetap di atas
    <div className="fixed left-0 top-0 flex h-screen w-64 flex-col bg-white border-r border-gray-200 z-50">
      {/* Logo Area */}
      <div className="flex h-20 items-center justify-center border-b border-gray-100">
        <h1 className="text-2xl font-bold text-[#299E63]">Recyloop</h1>
      </div>

      {/* Menu Area */}
      <nav className="flex-1 space-y-2 px-4 py-6 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                isActive
                  ? "bg-[#299E63] text-white shadow-md shadow-[#299E63]/30"
                  : "text-gray-500 hover:bg-[#299E63]/10 hover:text-[#299E63]"
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium font-poppins text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Area */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex w-full items-center space-x-3 rounded-xl px-4 py-3 text-red-500 transition-all hover:bg-red-50 cursor-pointer"
        >
          <LogOut size={20} />
          <span className="font-medium font-poppins text-sm">Keluar</span>
        </button>
      </div>
    </div>
  );
}