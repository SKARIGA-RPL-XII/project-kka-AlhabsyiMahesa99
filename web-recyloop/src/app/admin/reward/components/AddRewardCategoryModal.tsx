"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { adminQueryKeys } from "@/app/admin/queryKeys";
import { Save, Tags, X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function AddRewardCategoryModal({ open, onClose }: Props) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  if (!open) return null;

  const resetAndClose = () => {
    setName("");
    setDescription("");
    setMessage(null);
    setSubmitting(false);
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setSubmitting(true);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setMessage({ type: "error", text: "Nama kategori wajib diisi." });
      setSubmitting(false);
      return;
    }

    const { error } = await supabase.from("reward_categories").insert({
      name: trimmedName,
      description: description || null,
      is_active: true,
    });

    if (error) {
      setMessage({ type: "error", text: `Gagal menambah kategori: ${error.message}` });
      setSubmitting(false);
      return;
    }

    await queryClient.invalidateQueries({ queryKey: adminQueryKeys.reward.categories });
    setMessage({ type: "success", text: "Kategori reward berhasil ditambahkan." });
    setTimeout(() => {
      resetAndClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={resetAndClose}>
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-gray-100 bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between bg-[#222D33] p-6 text-white">
          <div>
            <h2 className="text-xl font-bold font-poppins">Tambah Kategori Reward</h2>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            className="rounded-full p-2 text-gray-200 transition hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-8">
          {message && (
            <div
              className={`rounded-xl border px-4 py-3 text-sm font-medium ${
                message.type === "success"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <div>
            <label className="text-sm font-semibold text-gray-700">Nama Kategori</label>
            <div className="relative mt-1">
              <Tags className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="w-full rounded-xl border border-gray-200 px-10 py-3 text-sm text-black focus:border-[#299E63] focus:outline-none"
                placeholder="Contoh: Voucher Belanja"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">Deskripsi</label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="mt-1 min-h-24 w-full rounded-xl border border-gray-200 px-3 py-3 text-sm text-black focus:border-[#299E63] focus:outline-none"
              placeholder="Contoh: Kategori voucher minimarket, supermarket, dan e-commerce."
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#299E63] px-5 py-3 text-sm font-semibold text-white hover:bg-[#238b56] disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              <Save size={16} /> {submitting ? "Menyimpan..." : "Simpan Kategori"}
            </button>
            <button
              type="button"
              onClick={resetAndClose}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
