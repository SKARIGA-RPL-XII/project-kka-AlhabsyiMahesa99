import { Search } from "lucide-react";
import { StatusFilter } from "../types/riwayat";

type Props = {
  activeStatus: StatusFilter;
  search: string;
  statusTabs: { id: StatusFilter; label: string }[];
  onChangeStatus: (status: StatusFilter) => void;
  onChangeSearch: (value: string) => void;
};

export function RiwayatFilters({ activeStatus, search, statusTabs, onChangeStatus, onChangeSearch }: Props) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      {/* Filter + Search */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {statusTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onChangeStatus(tab.id)}
              className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition ${
                activeStatus === tab.id
                  ? "bg-[#299E63] text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            value={search}
            onChange={(e) => onChangeSearch(e.target.value)}
            placeholder="Cari ID, alamat, kategori, status..."
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm focus:border-[#299E63] focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
