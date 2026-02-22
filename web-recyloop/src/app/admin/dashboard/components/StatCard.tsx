import React from "react";

type Props = {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: "blue" | "orange" | "green" | "purple";
  grow: string;
};

function getGrowClass(grow: string) {
  if (grow.toLowerCase().includes("perlu action")) {
    return "bg-orange-50 text-orange-600";
  }

  if (grow.includes("-")) {
    return "bg-red-50 text-red-500";
  }

  return "bg-green-50 text-green-600";
}

export function StatCard({ title, value, icon, color, grow }: Props) {
  const colors: Record<Props["color"], string> = {
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    green: "bg-green-50 text-[#299E63]",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colors[color]}`}>{icon}</div>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${getGrowClass(grow)}`}>{grow}</span>
      </div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <h2 className="text-2xl font-bold text-[#222D33] mt-1">{value}</h2>
    </div>
  );
}
