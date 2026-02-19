import { Coins, Wallet } from "lucide-react";
import { UserProfile } from "../types/reward";

type Props = {
  profile: UserProfile | null;
  totalRedeemedAmount: number;
  formatRupiah: (value: number) => string;
};

export function RewardSummaryCards({ profile, totalRedeemedAmount, formatRupiah }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-500">
          <Coins size={16} className="text-[#299E63]" /> Total Poin Kamu
        </div>
        <p className="mt-2 text-2xl font-bold">{(profile?.total_points || 0).toLocaleString("id-ID")} poin</p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-500">
          <Wallet size={16} className="text-[#299E63]" /> Total Nominal Redeem
        </div>
        <p className="mt-2 text-2xl font-bold">{formatRupiah(totalRedeemedAmount)}</p>
      </div>
    </div>
  );
}
