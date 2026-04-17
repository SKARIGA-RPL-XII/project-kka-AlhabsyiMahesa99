"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCircle2, MapPin, Recycle, RefreshCcw } from "lucide-react";
import { supabase } from "@/lib/supabase";

type CompletedPickupNotification = {
  id: string;
  created_at: string;
  completed_at: string | null;
  pickup_address: string | null;
  total_weight: number | null;
  total_points_earned: number | null;
  waste_category: { name: string | null } | { name: string | null }[] | null;
};

const ITEMS_PER_PAGE = 5;

export default function UserNotifikasiPage() {
  const router = useRouter();

  // State notifikasi user
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [items, setItems] = useState<CompletedPickupNotification[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Helper relasi Supabase (object/array)
  const pickFirst = <T,>(value: T | T[] | null | undefined): T | null => {
    if (!value) return null;
    return Array.isArray(value) ? (value[0] ?? null) : value;
  };

  const formatDateTime = (value: string | null) => {
    if (!value) return "-";
    return new Date(value).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchNotifications = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) {
        setItems([]);
        setLoading(false);
        return;
      }

      // Ambil notifikasi dari pickup selesai milik user
      const { data, error } = await supabase
        .from("pickups")
        .select(
          `
          id,
          created_at,
          completed_at,
          pickup_address,
          total_weight,
          total_points_earned,
          waste_category:waste_categories!pickups_waste_category_id_fkey(name)
        `,
        )
        .eq("user_id", user.id)
        .eq("status", "completed")
        .order("completed_at", { ascending: false });

      if (error) throw error;

      setItems((data as CompletedPickupNotification[]) || []);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Gagal memuat notifikasi.";
      setErrorMessage(message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));

  const paginatedItems = useMemo(() => {
    const from = (currentPage - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE;
    return items.slice(from, to);
  }, [currentPage, items]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="space-y-8 font-poppins text-[#222D33]">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifikasi</h1>
          <p className="mt-1 text-gray-500">
            Konfirmasi otomatis ketika setoranmu telah sukses diangkut dan diselesaikan.
          </p>
        </div>

        <button
          onClick={fetchNotifications}
          className="cursor-pointer inline-flex items-center gap-2 self-start rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          <RefreshCcw size={14} /> Refresh
        </button>
      </div>

      {/* Ringkasan */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Notifikasi</p>
          <p className="mt-2 text-2xl font-bold">{items.length}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Status</p>
          <p className="mt-2 text-2xl font-bold text-[#299E63]">Selesai</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Periode</p>
          <p className="mt-2 text-2xl font-bold">Realtime</p>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {errorMessage}
        </div>
      )}

      {/* List Notifikasi */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="inline-flex items-center gap-2 text-lg font-bold">
            <Bell size={18} className="text-[#299E63]" />
            Notifikasi Selesai
          </h3>

          <button
            onClick={() => router.push("/user/riwayat")}
            className="cursor-pointer text-sm font-semibold text-[#299E63] hover:underline"
          >
            Lihat Riwayat
          </button>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">Memuat notifikasi...</div>
          ) : paginatedItems.length === 0 ? (
            <div className="rounded-xl bg-gray-50 p-6 text-sm italic text-gray-500">
              Belum ada notifikasi selesai. Setor sampah dulu yuk.
            </div>
          ) : (
            paginatedItems.map((item) => {
              const category = pickFirst(item.waste_category);
              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-gray-100 bg-white p-4 transition hover:border-gray-200 hover:bg-gray-50"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                      <p className="inline-flex items-center gap-2 text-sm font-bold text-[#222D33]">
                        <CheckCircle2 size={16} className="text-[#299E63]" />
                        Sampah kamu berhasil diangkut
                      </p>
                      <p className="text-xs text-gray-500">
                        ID: <span className="font-semibold">REC-{item.id.slice(0, 5).toUpperCase()}</span> •{" "}
                        {formatDateTime(item.completed_at || item.created_at)}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1">
                          <Recycle size={12} /> {category?.name || "Kategori"}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1">
                          <MapPin size={12} /> {item.pickup_address || "Alamat pickup"}
                        </span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-sm font-bold text-[#299E63]">
                        +{(item.total_points_earned || 0).toLocaleString("id-ID")} poin
                      </p>
                      <p className="text-xs text-gray-500">{(item.total_weight || 0).toLocaleString("id-ID")} Kg</p>
                      <span className="mt-1 inline-block rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
                        SELESAI
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
            <p className="text-sm text-gray-500">
              Halaman {currentPage} dari {totalPages}
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Prev
              </button>
              <span className="px-2 text-sm text-gray-500">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="cursor-pointer rounded-lg border border-[#299E63] bg-[#299E63] px-4 py-2 text-sm font-semibold text-white hover:bg-[#238b56] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}