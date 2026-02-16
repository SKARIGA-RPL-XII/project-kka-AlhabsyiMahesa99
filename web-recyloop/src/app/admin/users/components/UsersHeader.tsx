import React from "react";
import { Search, UserPlus } from "lucide-react";

export function UsersHeader({
  onAddCourier,
}: {
  onAddCourier: () => void;
}) {
  return (
    // Header
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen User</h1>
          <p className="mt-1 text-gray-500">
            Kelola akun warga dan kurir. Admin dapat menonaktifkan akun pelanggar beserta alasan pelanggaran.
          </p>
        </div>

        <button
          onClick={onAddCourier}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#299E63] px-5 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#238b56]"
        >
          <UserPlus size={18} />
          Tambah Kurir
        </button>
      </div>
    </div>
  );
}

export function UsersTabsAndSearch({
  activeTab,
  onTabChange,
  searchTerm,
  onSearchChange,
}: {
  activeTab: "user" | "kurir";
  onTabChange: (tab: "user" | "kurir") => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}) {
  return (
    // Tabs + Search
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="w-fit rounded-2xl bg-gray-100/80 p-1.5 backdrop-blur-sm">
        <button
          onClick={() => onTabChange("user")}
          className={`cursor-pointer rounded-xl px-8 py-2.5 text-sm font-semibold transition-all duration-300 ${
            activeTab === "user" ? "bg-white text-[#299E63] shadow-md" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Warga
        </button>
        <button
          onClick={() => onTabChange("kurir")}
          className={`cursor-pointer rounded-xl px-8 py-2.5 text-sm font-semibold transition-all duration-300 ${
            activeTab === "kurir" ? "bg-white text-blue-600 shadow-md" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Kurir
        </button>
      </div>

      <div className="relative group w-full md:max-w-md">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-[#299E63]"
          size={20}
        />
        <input
          type="text"
          placeholder="Cari warga atau kurir..."
          className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-12 pr-6 text-sm shadow-sm transition-all focus:border-[#299E63] focus:outline-none focus:ring-2 focus:ring-[#299E63]/20"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}
