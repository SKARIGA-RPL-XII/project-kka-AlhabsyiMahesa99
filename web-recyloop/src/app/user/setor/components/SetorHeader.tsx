import { Plus } from "lucide-react";

type Props = {
  onAddSetoran: () => void;
};

export function SetorHeader({ onAddSetoran }: Props) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-[#222D33]">Data Setoran</h1>
        <p className="mt-1 text-gray-500">Pantau dan kelola riwayat setoran sampahmu.</p>
      </div>
      <button
        onClick={onAddSetoran}
        className="cursor-pointer active:scale-95 flex items-center justify-center gap-2 rounded-xl bg-[#299E63] px-6 py-3 font-bold text-white shadow-lg shadow-[#299E63]/20 transition-all hover:bg-[#238b56]"
      >
        <Plus size={20} />
        Tambah Setoran
      </button>
    </div>
  );
}
