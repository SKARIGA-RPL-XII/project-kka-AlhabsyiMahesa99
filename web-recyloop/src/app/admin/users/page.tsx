"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Search, UserCheck, UserX, Mail, Phone, ArrowLeftRight, MoreVertical } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface UserProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  role: 'user' | 'kurir' | 'admin';
  is_active: boolean;
  avatar_url: string | null;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("user");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", activeTab)
        .order("full_name", { ascending: true });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    if (confirm(newStatus ? "Aktifkan user?" : "Nonaktifkan user?")) {
      try {
        const { error } = await supabase
          .from("profiles")
          .update({ is_active: newStatus })
          .eq("id", userId);
        if (error) throw error;
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: newStatus } : u));
      } catch (error) {
        alert("Gagal update status");
      }
    }
  };

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.includes(searchTerm)
  );

  return (
    <div className="space-y-8 font-poppins pb-10 text-[#222D33]">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen User</h1>
          <p className="text-gray-500 mt-1">Kelola hak akses dan informasi seluruh pengguna Recyloop.</p>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#299E63] transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Cari warga atau kurir..."
            className="pl-12 pr-6 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#299E63]/20 focus:border-[#299E63] w-full md:w-80 shadow-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 p-1.5 bg-gray-100/80 w-fit rounded-2xl backdrop-blur-sm">
        <button 
          onClick={() => setActiveTab("user")}
          className={`cursor-pointer px-8 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === "user" ? "bg-white text-[#299E63] shadow-md" : "text-gray-500 hover:text-gray-700"}`}
        >
          Warga
        </button>
        <button 
          onClick={() => setActiveTab("kurir")}
          className={`cursor-pointer px-8 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === "kurir" ? "bg-white text-blue-600 shadow-md" : "text-gray-500 hover:text-gray-700"}`}
        >
          Kurir
        </button>
      </div>

      {/* Main Table Content */}
      <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50 text-gray-400 text-[11px] uppercase tracking-[2px] font-bold">
                <th className="px-8 py-6">Profil Pengguna</th>
                <th className="px-8 py-6">Informasi Kontak</th>
                <th className="px-8 py-6 text-center">Status</th>
                <th className="px-8 py-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={4} className="px-8 py-20 text-center text-gray-400 animate-pulse">Memuat data pengguna...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={4} className="px-8 py-20 text-center text-gray-400">Tidak ada pengguna ditemukan.</td></tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="group hover:bg-gray-50/80 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img 
                            src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.full_name}&background=F3F4F6&color=299E63&bold=true`} 
                            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-gray-50 shadow-sm" 
                            alt=""
                          />
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${user.is_active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800 group-hover:text-[#299E63] transition-colors">{user.full_name || "Tanpa Nama"}</p>
                          <p className="text-[11px] text-gray-400 font-medium mt-0.5 uppercase tracking-wider">ID: {user.id.slice(0,8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail size={14} className="text-gray-400" />
                          <span className="text-xs font-medium">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone size={14} className="text-gray-400" />
                          <span className="text-xs font-medium">{user.phone || "--"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-bold tracking-wide ${
                        user.is_active 
                        ? 'bg-green-50 text-green-600' 
                        : 'bg-red-50 text-red-500'
                      }`}>
                        {user.is_active ? 'AKTIF' : 'NONAKTIF'}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => toggleUserStatus(user.id, user.is_active)}
                          className={`p-2.5 rounded-xl transition-all ${
                            user.is_active 
                            ? 'hover:bg-red-50 text-gray-400 hover:text-red-500' 
                            : 'hover:bg-green-50 text-gray-400 hover:text-green-500'
                          }`}
                          title={user.is_active ? "Nonaktifkan" : "Aktifkan"}
                        >
                          {user.is_active ? <UserX size={18}/> : <UserCheck size={18}/>}
                        </button>
                        
                        {activeTab === 'user' && (
                          <button 
                            onClick={() => {/* logic promote */}}
                            className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                            title="Jadikan Kurir"
                          >
                            <ArrowLeftRight size={18}/>
                          </button>
                        )}
                        <button className="p-2.5 text-gray-300 hover:text-gray-600 transition-all">
                          <MoreVertical size={18}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}