import { Reward } from "../types/reward";
import { CatalogTitle } from "./RewardPageHeader";

type Props = {
  loading: boolean;
  rewards: Reward[];
  profilePoints: number;
  processingRewardId: number | null;
  expandedRewardId: number | null;
  onToggleDetail: (rewardId: number) => void;
  onRedeem: (rewardId: number) => void;
  formatRupiah: (value: number) => string;
};

export function RewardCatalogGrid({
  loading,
  rewards,
  profilePoints,
  processingRewardId,
  expandedRewardId,
  onToggleDetail,
  onRedeem,
  formatRupiah,
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <CatalogTitle />

      {loading ? (
        <p className="text-sm text-gray-400">Memuat reward...</p>
      ) : rewards.length === 0 ? (
        <p className="text-sm italic text-gray-500">Belum ada reward untuk kategori ini.</p>
      ) : (
        <>
          {/* Katalog dibuat 1 baris horizontal agar hemat tempat dan bisa digeser jika data banyak. */}
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
          {rewards.map((reward) => {
            const canRedeem = profilePoints >= reward.points_required;
            const isProcessing = processingRewardId === reward.id;
            const isExpanded = expandedRewardId === reward.id;

            return (
              <div
                key={reward.id}
                className="min-w-full snap-start rounded-xl border border-gray-100 p-4 md:min-w-[calc((100%-1rem)/2)] xl:min-w-[calc((100%-2rem)/3)]"
              >
                {reward.image_url ? (
                  <div className="mb-3 h-36 w-full rounded-lg bg-gray-50 p-2">
                    <img
                      src={reward.image_url}
                      alt={reward.title}
                      className="h-full w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="mb-3 flex h-36 w-full items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                    Tidak ada gambar
                  </div>
                )}

                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                    {reward.reward_category || "Lainnya"}
                  </span>
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-600">
                    {reward.partner_name || "Partner Umum"}
                  </span>
                </div>

                <h3 className="text-base font-bold">{reward.title}</h3>
                <p className="mt-1 min-h-10 text-sm text-gray-500">{reward.description || "Tanpa deskripsi."}</p>

                <div className="mt-3 space-y-1 text-sm">
                  <p>
                    Butuh poin: <span className="font-bold text-amber-600">{reward.points_required.toLocaleString("id-ID")}</span>
                  </p>
                  <p>
                    Nilai reward: <span className="font-bold text-[#299E63]">{formatRupiah(reward.amount_value)}</span>
                  </p>
                  <p>
                    Stok tersisa: <span className="font-bold">{(reward.stock || 0).toLocaleString("id-ID")}</span>
                  </p>
                </div>

                <button
                  onClick={() => onToggleDetail(reward.id)}
                  className="mt-3 cursor-pointer text-xs font-semibold text-[#299E63] hover:underline"
                >
                  {isExpanded ? "Sembunyikan Detail" : "Lihat Detail Klaim"}
                </button>

                {isExpanded && (
                  <div className="mt-2 rounded-lg border border-gray-100 bg-gray-50 p-3 text-xs text-gray-600">
                    <p className="font-semibold text-gray-700">Detail Klaim</p>
                    <p className="mt-1 leading-relaxed">
                      {reward.redemption_note || "Benefit diproses via sistem setelah redeem berhasil."}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => onRedeem(reward.id)}
                  disabled={!canRedeem || isProcessing}
                  className="mt-4 w-full cursor-pointer rounded-lg bg-[#299E63] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#238b56] disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  {isProcessing ? "Memproses..." : canRedeem ? "Redeem Sekarang" : "Poin Tidak Cukup"}
                </button>
              </div>
            );
          })}
          </div>
        </>
      )}
    </div>
  );
}
