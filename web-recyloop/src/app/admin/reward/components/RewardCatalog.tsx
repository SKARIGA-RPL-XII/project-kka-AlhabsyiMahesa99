import { Ban, Gift, Pencil } from "lucide-react";
import { Reward } from "../types/reward";

type Props = {
  loading: boolean;
  rewards: Reward[];
  formatRupiah: (value: number) => string;
  onEditStock: (reward: Reward) => void;
  onToggleActive: (reward: Reward) => void;
};

export function RewardCatalog({
  loading,
  rewards,
  formatRupiah,
  onEditStock,
  onToggleActive,
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Gift size={18} className="text-[#299E63]" />
        <h2 className="text-lg font-bold">Katalog Control</h2>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Memuat katalog reward...</p>
      ) : rewards.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center">
          <p className="text-sm text-gray-500">Belum ada reward. Mulai dari tambah kategori lalu tambah reward baru.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rewards.map((reward) => (
            <div key={reward.id} className="rounded-xl border border-gray-100 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold">{reward.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-500">{reward.description || "Tanpa deskripsi"}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    reward.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {reward.is_active ? "Aktif" : "Nonaktif"}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                  {reward.reward_category}
                </span>
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-600">
                  {reward.partner_name || "Partner Umum"}
                </span>
                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                  {reward.fulfillment_type === "code" ? "Kode Otomatis" : "Manual Admin"}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-gray-400">Poin</p>
                  <p className="font-bold">{reward.points_required.toLocaleString("id-ID")}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-gray-400">Nominal</p>
                  <p className="font-bold">{formatRupiah(reward.amount_value)}</p>
                </div>
                <div className="col-span-2 rounded-lg bg-gray-50 p-3">
                  <p className="text-gray-400">Stok / Limit</p>
                  <p className="font-bold">{(reward.stock ?? 0).toLocaleString("id-ID")}</p>
                </div>
              </div>

              {reward.redemption_note && (
                <div className="mt-3 rounded-lg border border-gray-100 bg-gray-50 p-3 text-xs text-gray-600">
                  <span className="font-semibold">Detail Klaim:</span> {reward.redemption_note}
                </div>
              )}

              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => onEditStock(reward)}
                  className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold hover:bg-gray-50"
                >
                  <Pencil size={16} /> Edit Stok
                </button>
                <button
                  onClick={() => onToggleActive(reward)}
                  className={`cursor-pointer inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${
                    reward.is_active
                      ? "border border-red-200 text-red-600 hover:bg-red-50"
                      : "border border-green-200 text-green-700 hover:bg-green-50"
                  }`}
                >
                  <Ban size={16} /> {reward.is_active ? "Nonaktifkan" : "Aktifkan"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
