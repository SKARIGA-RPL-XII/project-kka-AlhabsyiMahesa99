"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";

const REWARD_IMAGE_BUCKET = "reward-images";

type RewardCategory = {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
};

type FulfillmentType = "code" | "manual";

export default function AddRewardPage() {
  const router = useRouter();

  // State kategori dari tabel reward_categories
  const [categories, setCategories] = useState<RewardCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // State form tambah reward
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rewardCategory, setRewardCategory] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [redemptionNote, setRedemptionNote] = useState("");
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>("code");
  const [codePoolText, setCodePoolText] = useState("");
  const [pointsRequired, setPointsRequired] = useState(0);
  const [amountValue, setAmountValue] = useState(0);
  const [stock, setStock] = useState(999);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // State feedback
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Fetch kategori aktif
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);

      const { data, error } = await supabase
        .from("reward_categories")
        .select("id, name, description, is_active")
        .eq("is_active", true)
        .order("name", { ascending: true });

      if (!error && data && data.length > 0) {
        const typedCategories = data as RewardCategory[];
        setCategories(typedCategories);
        setRewardCategory(typedCategories[0].name);
      }

      setLoadingCategories(false);
    };

    fetchCategories();
  }, []);

  // Parse kode dari textarea (1 kode per baris)
  const parseCodes = (rawText: string): string[] => {
    const splitted = rawText
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    // Hilangkan duplikat kode agar pool bersih
    return Array.from(new Set(splitted));
  };

  // Generate kode otomatis saat admin tidak isi pool kode manual.
  const generateAutoCodes = (count: number): string[] => {
    const sourceLabel = (partnerName || rewardCategory || title || "RWD")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 4) || "RWD";

    const nominalLabel = Math.max(1, amountValue).toString().slice(0, 4);
    const generated = new Set<string>();

    while (generated.size < count) {
      const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
      generated.add(`${sourceLabel}${nominalLabel}-${randomPart}`);
    }

    return Array.from(generated);
  };

  // Submit tambah reward
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    if (!imageFile) {
      setMessage({ type: "error", text: "Foto reward wajib diupload." });
      return;
    }

    if (!rewardCategory.trim()) {
      setMessage({ type: "error", text: "Kategori reward wajib diisi." });
      return;
    }

    const parsedCodes = parseCodes(codePoolText);

    if (fulfillmentType === "code" && parsedCodes.length > 0) {
      if (parsedCodes.length < stock) {
        setMessage({
          type: "error",
          text: "Jumlah kode tidak boleh kurang dari stok. Tambah kode atau turunkan stok.",
        });
        return;
      }
    }

    setSubmitting(true);

    // Upload gambar reward ke Supabase Storage.
    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `reward-catalog/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(REWARD_IMAGE_BUCKET)
      .upload(filePath, imageFile, { upsert: false });

    if (uploadError) {
      setMessage({ type: "error", text: `Gagal upload foto reward: ${uploadError.message}` });
      setSubmitting(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from(REWARD_IMAGE_BUCKET)
      .getPublicUrl(filePath);

    // Insert reward dan ambil id reward baru.
    const { data: rewardData, error: insertError } = await supabase
      .from("rewards")
      .insert({
        title,
        description: description || null,
        reward_category: rewardCategory,
        partner_name: partnerName || null,
        redemption_note: redemptionNote || null,
        fulfillment_type: fulfillmentType,
        points_required: pointsRequired,
        amount_value: amountValue,
        stock,
        is_active: true,
        image_url: publicUrlData.publicUrl,
      })
      .select("id")
      .single();

    if (insertError || !rewardData) {
      setMessage({ type: "error", text: `Gagal menambah reward: ${insertError?.message || "Unknown error"}` });
      setSubmitting(false);
      return;
    }

    // Jika reward berbasis kode, simpan pool kode ke tabel reward_codes.
    if (fulfillmentType === "code") {
      // Jika pool manual kosong, sistem generate otomatis sesuai jumlah stok.
      const finalCodes = parsedCodes.length > 0 ? parsedCodes : generateAutoCodes(stock);
      const rows = finalCodes.map((code) => ({
        reward_id: rewardData.id,
        code,
      }));

      const { error: insertCodesError } = await supabase
        .from("reward_codes")
        .insert(rows);

      if (insertCodesError) {
        setMessage({ type: "error", text: `Reward tersimpan, tapi gagal simpan kode: ${insertCodesError.message}` });
        setSubmitting(false);
        return;
      }
    }

    setMessage({ type: "success", text: "Reward berhasil ditambahkan." });
    setSubmitting(false);
    router.push("/admin/reward");
  };

  return (
    <div className="font-poppins space-y-8 text-[#222D33]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tambah Reward</h1>
          <p className="mt-1 text-gray-500">Atur tipe fulfillment agar reward benar-benar realistis saat diredeem user.</p>
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
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold">Nama Reward</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#299E63] focus:outline-none"
              placeholder="Contoh: Voucer Alfamart 50.000"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Kategori</label>
            {loadingCategories ? (
              <p className="mt-1 text-sm text-gray-400">Memuat kategori...</p>
            ) : categories.length > 0 ? (
              <select
                value={rewardCategory}
                onChange={(e) => setRewardCategory(e.target.value)}
                className="mt-1 w-full cursor-pointer rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#299E63] focus:outline-none"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                value={rewardCategory}
                onChange={(e) => setRewardCategory(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#299E63] focus:outline-none"
                placeholder="Contoh: Voucher Belanja"
              />
            )}
            <p className="mt-1 text-xs text-gray-500">
              Jika belum ada kategori, tambahkan dulu di halaman Tambah Kategori.
            </p>
          </div>

          <div>
            <label className="text-sm font-semibold">Tipe Fulfillment</label>
            <select
              value={fulfillmentType}
              onChange={(e) => setFulfillmentType(e.target.value as FulfillmentType)}
              className="mt-1 w-full cursor-pointer rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#299E63] focus:outline-none"
            >
              <option value="code">Berbasis Kode (Voucher/Token/Pulsa)</option>
              <option value="manual">Manual (Tanpa Kode, diproses admin)</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold">Partner (Opsional)</label>
            <input
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#299E63] focus:outline-none"
              placeholder="Contoh: Alfamart / PLN / Telkomsel"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Deskripsi</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 min-h-20 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#299E63] focus:outline-none"
              placeholder="Deskripsi singkat reward"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Detail Klaim</label>
            <textarea
              value={redemptionNote}
              onChange={(e) => setRedemptionNote(e.target.value)}
              className="mt-1 min-h-20 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#299E63] focus:outline-none"
              placeholder="Contoh: Voucher makanan diproses admin maksimal 1x24 jam."
            />
          </div>

          {fulfillmentType === "code" && (
            <div>
              <label className="text-sm font-semibold">Pool Kode (1 kode per baris)</label>
              <textarea
                value={codePoolText}
                onChange={(e) => setCodePoolText(e.target.value)}
                className="mt-1 min-h-28 w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-xs focus:border-[#299E63] focus:outline-none"
                placeholder={"ALFA-50K-AB12\nALFA-50K-CD34\nALFA-50K-EF56"}
              />
              <p className="mt-1 text-xs text-gray-500">
                Opsional: jika dikosongkan, sistem auto-generate kode sesuai jumlah stok.
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold">Poin Dibutuhkan</label>
              <input
                type="number"
                min={0}
                value={pointsRequired}
                onChange={(e) => setPointsRequired(Number(e.target.value))}
                required
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#299E63] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Nominal (Rp)</label>
              <input
                type="number"
                min={0}
                value={amountValue}
                onChange={(e) => setAmountValue(Number(e.target.value))}
                required
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#299E63] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold">Stok / Limit</label>
            <input
              type="number"
              min={0}
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              required
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#299E63] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Foto Reward (Upload File)</label>
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setImageFile(file);
                setImagePreview(file ? URL.createObjectURL(file) : null);
              }}
              className="mt-1 w-full cursor-pointer rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#299E63] focus:outline-none"
            />
            {imagePreview && (
              <div className="mt-3">
                <p className="mb-2 text-xs text-gray-500">Preview:</p>
                <img
                  src={imagePreview}
                  alt="Preview reward"
                  className="h-24 w-24 rounded-lg border border-gray-200 object-cover"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-[#299E63] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#238b56] disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            <Plus size={16} /> {submitting ? "Menyimpan..." : "Simpan Reward"}
          </button>
        </form>
      </div>
    </div>
  );
}
