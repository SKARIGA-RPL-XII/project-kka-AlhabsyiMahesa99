"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Truck, 
  MapPin, 
  History, 
  UserCircle, 
  LogOut,
  ClipboardList
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function SidebarKurir() {
  const pathname = usePathname();
  const router = useRouter();

  // Menu disesuaikan dengan flow kurir
  const menuItems = [
    { name: "Dashboard", href: "/kurir/dashboard", icon: LayoutDashboard },
    { name: "Daftar Pickup", href: "/kurir/daftar-pickup", icon: ClipboardList },
    { name: "Tugas Aktif", href: "/kurir/tugas-aktif", icon: Truck }, // Halaman detail navigasi/validasi
    { name: "Riwayat Kerja", href: "/kurir/riwayat", icon: History },
    { name: "Profil Kurir", href: "/kurir/profil", icon: UserCircle },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Bersihkan cookies
    document.cookie = "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
    document.cookie = "sb-refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
    document.cookie = "user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";

    router.push("/login"); 
    router.refresh();
  };

  return (
    <div className="fixed left-0 top-0 flex h-screen w-64 flex-col bg-white border-r border-gray-200 z-50">
      {/* Logo Area */}
      <div className="flex flex-col h-24 items-center justify-center border-b border-gray-100">
        <h1 className="text-2xl font-bold text-[#299E63]">Recyloop</h1>
        <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
          Courier Panel
        </span>
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
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-gray-500 hover:bg-blue-50 hover:text-blue-600"
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