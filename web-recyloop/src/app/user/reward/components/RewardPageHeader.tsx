import { Gift } from "lucide-react";

export function RewardPageHeader() {
  return (
    <div>
      {/* Header */}
      <h1 className="text-3xl font-bold">Tukar Reward</h1>
      <p className="mt-1 text-gray-500">Pilih kategori reward dan tukarkan poinmu untuk benefit digital.</p>
    </div>
  );
}

export function CatalogTitle() {
  return (
    <div className="mb-4 flex items-center gap-2">
      <Gift size={18} className="text-[#299E63]" />
      <h2 className="text-lg font-bold">Katalog Reward</h2>
    </div>
  );
}
