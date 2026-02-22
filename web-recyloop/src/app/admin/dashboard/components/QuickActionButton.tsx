import React from "react";
import { ArrowUpRight } from "lucide-react";

type Props = {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
};

export function QuickActionButton({ label, icon, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer w-full flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all group"
    >
      <div className="flex items-center gap-3 text-gray-600 group-hover:text-[#299E63]">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <ArrowUpRight size={16} className="text-gray-300" />
    </button>
  );
}
