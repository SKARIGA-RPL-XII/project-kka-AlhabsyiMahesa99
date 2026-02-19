"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Tags } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AddRewardCategoryPage() {
  const router = useRouter();

  // State form kategori
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Submit kategori baru
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

    const { error } = await supabase
      .from("reward_categories")
      .insert({
        name: trimmedName,
        description: description || null,
        is_active: true,
      });

    if (error) {
      setMessage({ type: "error", text: `Gagal menambah kategori: ${error.message}` });
      setSubmitting(false);
      return;
    }

    setMessage({ type: "success", text: "Kategori reward berhasil ditambahkan." });
    setSubmitting(false);
    router.push("/admin/reward/tambah");
  };

  return (
    <div className="font-poppins space-y-8 text-[#222D33]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tambah Kategori Reward</h1>
          <p className="mt-1 text-gray-500">Buat kategori supaya katalog reward lebih terstruktur dan terasa nyata.</p>
        </div>
        <button
          onClick={() => router.push("/admin/reward")}
          className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft size={16} /> Kembali
        </button>
      </div>

      {/* Feedback */}
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

      {/* Form */}
      <div className="max-w-2xl rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold">Nama Kategori</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#299E63] focus:outline-none"
              placeholder="Contoh: Voucher Belanja"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Deskripsi (Opsional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 min-h-24 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#299E63] focus:outline-none"
              placeholder="Contoh: Kategori voucher minimarket, supermarket, dan e-commerce."
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-[#299E63] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#238b56] disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            <Tags size={16} /> {submitting ? "Menyimpan..." : "Simpan Kategori"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/admin/reward/tambah")}
            className="ml-3 cursor-pointer inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <Plus size={16} /> Lanjut Tambah Reward
          </button>
        </form>
      </div>
    </div>
  );
}
