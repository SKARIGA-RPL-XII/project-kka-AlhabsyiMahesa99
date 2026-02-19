import { RedemptionHistory, RewardRelation } from "../types/reward";

type Props = {
  selectedHistory: RedemptionHistory | null;
  pickFirstRelation: <T>(value: T | T[] | null | undefined) => T | null;
  onClose: () => void;
};

export function RedemptionDetailModal({ selectedHistory, pickFirstRelation, onClose }: Props) {
  if (!selectedHistory) return null;

  const reward = pickFirstRelation<RewardRelation>(selectedHistory.rewards);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold">Detail Reward</h3>
        <p className="mt-1 text-sm text-gray-500">{reward?.title || "Reward"}</p>

        <div className="mt-4 space-y-3 text-sm">
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-gray-400">Kategori</p>
            <p className="font-semibold text-gray-700">{reward?.reward_category || "-"}</p>
          </div>

          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-gray-400">Status Fulfillment</p>
            <p className="font-semibold text-gray-700">{selectedHistory.fulfillment_status || "completed"}</p>
          </div>

          {selectedHistory.fulfillment_code ? (
            <div className="rounded-lg border border-green-200 bg-green-50 p-3">
              <p className="text-xs font-semibold text-green-700">Kode Reward Kamu</p>
              <p className="mt-1 font-mono text-base font-bold text-green-800">{selectedHistory.fulfillment_code}</p>
            </div>
          ) : (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <p className="text-xs font-semibold text-amber-700">Tidak Ada Kode Otomatis</p>
              <p className="mt-1 text-sm text-amber-800">
                {reward?.redemption_note || "Reward ini diproses manual oleh admin."}
              </p>
            </div>
          )}
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
