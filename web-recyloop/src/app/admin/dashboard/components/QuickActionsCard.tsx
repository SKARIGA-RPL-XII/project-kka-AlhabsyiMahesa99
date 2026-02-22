import React from "react";
import { BarChart3, Database, Trophy, Users } from "lucide-react";
import { QuickActionButton } from "./QuickActionButton";

type Props = {
  onGoMaster: () => void;
  onGoReward: () => void;
  onGoUsers: () => void;
  onGoLaporan: () => void;
};

export function QuickActionsCard({ onGoMaster, onGoReward, onGoUsers, onGoLaporan }: Props) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      {/* Quick Actions (Data Master & Reward) */}
      <h3 className="font-bold text-gray-800 mb-6">Aksi Cepat</h3>
      <div className="space-y-3">
        <QuickActionButton label="Update Harga Sampah" icon={<Database size={18} />} onClick={onGoMaster} />
        <QuickActionButton label="Tambah Katalog Reward" icon={<Trophy size={18} />} onClick={onGoReward} />
        <QuickActionButton label="Verifikasi Kurir Baru" icon={<Users size={18} />} onClick={onGoUsers} />
        <QuickActionButton label="Download Laporan Bulanan" icon={<BarChart3 size={18} />} onClick={onGoLaporan} />
      </div>
    </div>
  );
}
