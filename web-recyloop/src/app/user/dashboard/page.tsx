"use client";
import React from 'react';
import { Wallet, Recycle, Clock, ArrowUpRight, Coins } from "lucide-react";

export default function UserDashboard() {
  // Data dummy 
  const stats = [
    { 
      title: "Saldo Digital", 
      value: "0", 
      unit: "IDR", 
      icon: Wallet, 
      color: "text-blue-600", 
      bg: "bg-blue-100" 
    },
    { 
      title: "Total Poin", 
      value: "2.500", 
      unit: "Pts", 
      icon: Coins, 
      color: "text-purple-600", 
      bg: "bg-purple-100" 
    },
    { 
      title: "Sampah Terkumpul", 
      value: "12.5", 
      unit: "Kg", 
      icon: Recycle, 
      color: "text-green-600", 
      bg: "bg-green-100" 
    },
    { 
      title: "Status Jemput", 
      value: "1", 
      unit: "Pending", 
      icon: Clock, 
      color: "text-orange-600", 
      bg: "bg-orange-100" 
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Welcome */}
      <div>
        <h1 className="text-3xl font-bold text-[#222D33] font-poppins">Halo, Users!</h1>
        <p className="text-gray-500 font-poppins mt-1">Kelola saldo dan kontribusimu untuk bumi hari ini.</p>
      </div>

      {/* Stats Grid - 4 Kolom di Desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                <stat.icon size={24} />
              </div>
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
            </div>
            <div className="mt-4">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider font-poppins">{stat.title}</p>
              <h3 className="text-xl font-bold text-[#222D33] mt-1 flex items-baseline gap-1 font-poppins">
                {stat.value} 
                <span className="text-xs font-normal text-gray-400">{stat.unit}</span>
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Banner Aksi Cepat */}
      <div className="bg-[#299E63] rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between shadow-lg shadow-[#299E63]/20">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-2xl font-bold font-poppins">Punya sampah di rumah?</h2>
          <p className="text-green-50 opacity-90 font-poppins">Yuk setor sekarang dan kumpulkan poin untuk ditukar ke saldo!</p>
        </div>
        <button className="mt-6 md:mt-0 bg-white text-[#299E63] px-8 py-3 rounded-xl font-bold hover:bg-green-50 transition active:scale-95 shadow-lg cursor-pointer font-poppins">
          Setor Sekarang
        </button>
      </div>

      {/* Riwayat Terakhir */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-[#222D33] font-poppins">Aktivitas Terakhir</h3>
          <button className="text-sm text-[#299E63] font-semibold hover:underline font-poppins">Lihat Semua</button>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition border border-transparent hover:border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="bg-gray-100 p-2 rounded-lg text-gray-600">
                  <Recycle size={20} />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm font-poppins">Setor Sampah Plastik & Kertas</p>
                  <p className="text-[10px] text-gray-400 font-poppins italic">24 Jan 2026 • 14:30 WIB</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-[#299E63] text-sm font-poppins">+150 Pts</p>
                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-poppins">
                  Selesai
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}