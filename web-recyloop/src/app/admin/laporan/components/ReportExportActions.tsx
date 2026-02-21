import { Download, FileSpreadsheet, FileText } from "lucide-react";

type Props = {
  onExportXlsx: () => void;
  onExportPdf: () => void;
};

export function ReportExportActions({ onExportXlsx, onExportPdf }: Props) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      {/* Export Actions */}
      <div className="mb-4 flex items-center gap-2">
        <Download size={18} className="text-[#299E63]" />
        <h2 className="text-lg font-bold">Export Data</h2>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={onExportXlsx}
          className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          <FileSpreadsheet size={16} /> Export Excel (XLSX)
        </button>

        <button
          onClick={onExportPdf}
          className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-[#299E63] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#238b56]"
        >
          <FileText size={16} /> Export PDF
        </button>
      </div>
    </div>
  );
}
