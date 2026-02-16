import React from "react";
import { ShieldAlert, X } from "lucide-react";

export function SuspendUserModal({
  open,
  target,
  reason,
  setReason,
  submitting,
  onClose,
  onSubmit,
}: {
  open: boolean;
  target: { full_name: string; role: "user" | "kurir" } | null;
  reason: string;
  setReason: (value: string) => void;
  submitting: boolean;
  onClose: () => void;
  onSubmit: () => void;
}) {
  if (!open || !target) return null;

  return (
    // Suspend Modal
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-[#222D33]">Nonaktifkan Akun</h3>
            <p className="mt-1 text-sm text-gray-500">
              Masukkan alasan pelanggaran sebelum menonaktifkan akun.
            </p>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Target Akun</p>
          <p className="mt-1 font-semibold text-[#222D33]">{target.full_name}</p>
          <p className="text-xs text-gray-500">Role: {target.role === "kurir" ? "Kurir" : "Warga"}</p>
        </div>

        <div className="mt-4">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Alasan Nonaktif</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            placeholder="Contoh: Melanggar aturan platform / penyalahgunaan sistem / tindakan merugikan pengguna lain"
            className="mt-2 w-full rounded-2xl border border-gray-200 bg-white p-3 text-sm text-black outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
          />
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            onClick={onSubmit}
            disabled={submitting}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-bold text-white hover:bg-red-600 disabled:opacity-50"
          >
            <ShieldAlert size={16} />
            {submitting ? "Memproses..." : "Nonaktifkan"}
          </button>
        </div>
      </div>
    </div>
  );
}
