import React from "react";
import { UserPlus, X } from "lucide-react";

export function AddCourierModal({
  open,
  form,
  onChange,
  onClose,
  onSubmit,
  creating,
}: {
  open: boolean;
  form: {
    fullName: string;
    email: string;
    password: string;
    phone: string;
    address: string;
  };
  onChange: (field: keyof AddCourierModalProps["form"], value: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  creating: boolean;
}) {
  if (!open) return null;

  return (
    // Add Courier Modal
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-[#222D33]">Tambah Kurir Baru</h3>
            <p className="mt-1 text-sm text-gray-500">Buat akun pekerja kurir langsung dari panel admin.</p>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Nama Lengkap</label>
            <input
              value={form.fullName}
              onChange={(e) => onChange("fullName", e.target.value)}
              type="text"
              required
              className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none focus:border-[#299E63] focus:ring-2 focus:ring-[#299E63]/20"
              placeholder="Masukkan nama kurir"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Email</label>
            <input
              value={form.email}
              onChange={(e) => onChange("email", e.target.value)}
              type="email"
              required
              className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none focus:border-[#299E63] focus:ring-2 focus:ring-[#299E63]/20"
              placeholder="contoh@recyloop.com"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Password</label>
            <input
              value={form.password}
              onChange={(e) => onChange("password", e.target.value)}
              type="password"
              required
              minLength={6}
              className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none focus:border-[#299E63] focus:ring-2 focus:ring-[#299E63]/20"
              placeholder="Minimal 6 karakter"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">No. HP</label>
            <input
              value={form.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              type="text"
              className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none focus:border-[#299E63] focus:ring-2 focus:ring-[#299E63]/20"
              placeholder="08xxxxxxxxxx"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Alamat</label>
            <input
              value={form.address}
              onChange={(e) => onChange("address", e.target.value)}
              type="text"
              className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none focus:border-[#299E63] focus:ring-2 focus:ring-[#299E63]/20"
              placeholder="Alamat domisili"
            />
          </div>

          <div className="md:col-span-2 flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={creating}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#299E63] px-4 py-2 text-sm font-bold text-white hover:bg-[#238b56] disabled:opacity-50"
            >
              <UserPlus size={16} />
              {creating ? "Membuat..." : "Buat Akun Kurir"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

type AddCourierModalProps = {
  form: {
    fullName: string;
    email: string;
    password: string;
    phone: string;
    address: string;
  };
};
