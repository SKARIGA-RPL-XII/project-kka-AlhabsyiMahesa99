"use client";

import type { ReactNode } from "react";
import { Database, Layers, TrendingUp } from "lucide-react";

type MasterOverviewCardsProps = {
  totalCategories: number;
  highestPoint: number;
  totalVolumeKg: number;
};

type OverviewCardProps = {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  toneClassName: string;
};

function OverviewCard({
  icon,
  label,
  value,
  toneClassName,
}: OverviewCardProps) {
  return (
    <div className="flex items-center gap-5 rounded-2xl border bg-white p-6 shadow-sm">
      <div className={`rounded-2xl p-4 ${toneClassName}`}>{icon}</div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
          {label}
        </p>
        <p className="text-2xl font-bold text-[#222D33]">{value}</p>
      </div>
    </div>
  );
}

export function MasterOverviewCards({
  totalCategories,
  highestPoint,
  totalVolumeKg,
}: MasterOverviewCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <OverviewCard
        icon={<Layers size={24} />}
        label="Total Jenis"
        value={totalCategories}
        toneClassName="bg-blue-50 text-blue-600"
      />
      <OverviewCard
        icon={<TrendingUp size={24} />}
        label="Poin Tertinggi"
        value={highestPoint}
        toneClassName="bg-green-50 text-[#299E63]"
      />
      <OverviewCard
        icon={<Database size={24} />}
        label="Total Volume"
        value={
          <>
            {totalVolumeKg.toLocaleString("id-ID", {
              minimumFractionDigits: totalVolumeKg % 1 === 0 ? 0 : 1,
              maximumFractionDigits: 1,
            })}{" "}
            <span className="text-xs text-gray-400">Kg</span>
          </>
        }
        toneClassName="bg-orange-50 text-orange-600"
      />
    </div>
  );
}
