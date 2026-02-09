"use client";
import SidebarKurir from "@/components/sidebar/SidebarKurir";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar tetap di kiri */}
      <SidebarKurir />
      
      {/* Konten dashboard di kanan */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}