import { useRouter } from "next/navigation";
import { Plus, Tags } from "lucide-react";

type Props = {
  title: string;
  subtitle: string;
};

export function RewardHeader({ title, subtitle }: Props) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        {/* Header Title */}
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-gray-500">{subtitle}</p>
      </div>

      {/* Header CTA: dipaksa sejajar */}
      <div className="ml-auto flex flex-row flex-nowrap items-center gap-3">
        <button
          onClick={() => router.push("/admin/reward/kategori/tambah")}
          className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          <Tags size={16} /> Tambah Kategori
        </button>
        <button
          onClick={() => router.push("/admin/reward/tambah")}
          className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-[#299E63] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#238b56]"
        >
          <Plus size={16} /> Tambah Reward
        </button>
      </div>
    </div>
  );
}
