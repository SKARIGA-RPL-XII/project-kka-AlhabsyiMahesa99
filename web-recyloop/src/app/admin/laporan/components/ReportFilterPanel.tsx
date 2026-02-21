import { CalendarDays, Filter } from "lucide-react";
import { MONTH_OPTIONS } from "../constants/report";
import { PeriodType } from "../types/report";

type Props = {
  periodType: PeriodType;
  selectedMonth: number;
  selectedYear: number;
  loading: boolean;
  onChangePeriodType: (value: PeriodType) => void;
  onChangeSelectedMonth: (value: number) => void;
  onChangeSelectedYear: (value: number) => void;
  onGenerate: () => void;
};

export function ReportFilterPanel({
  periodType,
  selectedMonth,
  selectedYear,
  loading,
  onChangePeriodType,
  onChangeSelectedMonth,
  onChangeSelectedYear,
  onGenerate,
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      {/* Panel Filter */}
      <div className="mb-4 flex items-center gap-2">
        <Filter size={18} className="text-[#299E63]" />
        <h2 className="text-lg font-bold">Filter Periode Laporan</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div>
          <label className="text-sm font-semibold">Tipe Periode</label>
          <select
            value={periodType}
            onChange={(e) => onChangePeriodType(e.target.value as PeriodType)}
            className="mt-1 w-full cursor-pointer rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#299E63] focus:outline-none"
          >
            <option value="monthly">Bulanan</option>
            <option value="yearly">Tahunan</option>
          </select>
        </div>

        {periodType === "monthly" && (
          <div>
            <label className="text-sm font-semibold">Bulan</label>
            <select
              value={selectedMonth}
              onChange={(e) => onChangeSelectedMonth(Number(e.target.value))}
              className="mt-1 w-full cursor-pointer rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#299E63] focus:outline-none"
            >
              {MONTH_OPTIONS.map((month, index) => (
                <option key={month} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="text-sm font-semibold">Tahun</label>
          <input
            type="number"
            min={2020}
            value={selectedYear}
            onChange={(e) => onChangeSelectedYear(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#299E63] focus:outline-none"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={onGenerate}
            disabled={loading}
            className="cursor-pointer inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#299E63] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#238b56] disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            <CalendarDays size={16} /> {loading ? "Memproses..." : "Generate Laporan"}
          </button>
        </div>
      </div>
    </div>
  );
}
