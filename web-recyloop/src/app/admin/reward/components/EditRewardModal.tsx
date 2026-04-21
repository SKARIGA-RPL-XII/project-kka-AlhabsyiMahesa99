import { Reward } from "../types/reward";

type Props = {
  reward: Reward | null;
  editStock: number;
  editPoints: number;
  onChangeStock: (value: number) => void;
  onChangePoints: (value: number) => void;
  onCancel: () => void;
  onSave: () => void;
};

export function EditRewardModal({
  reward,
  editStock,
  editPoints,
  onChangeStock,
  onChangePoints,
  onCancel,
  onSave,
}: Props) {
  if (!reward) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-bold">Edit Reward</h3>
        <p className="mt-1 text-sm text-gray-500">{reward.title}</p>

        <div className="mt-4 space-y-3">
          <div>
            <label className="text-sm font-semibold">Stock / Limit</label>
            <input
              type="number"
              min={0}
              value={editStock}
              onChange={(e) => onChangeStock(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#299E63] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Harga Poin</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={editPoints === 0 ? "" : editPoints}
              onChange={(e) => {
                let value = e.target.value;

                // hanya angka
                value = value.replace(/[^0-9]/g, "");

                onChangePoints(value === "" ? 0 : Number(value));
              }}
              placeholder="Masukkan poin"
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#299E63] focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            onClick={onSave}
            className="cursor-pointer rounded-lg bg-[#299E63] px-4 py-2 text-sm font-semibold text-white hover:bg-[#238b56]"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
