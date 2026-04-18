"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useNotifications } from "./hooks/useNotifications";
import { NotificationList } from "./components/NotificationList";
import { NotificationSummaryCards } from "./components/NotificationSummaryCards";

export default function UserNotifikasiPage() {
  const router = useRouter();
  const { loading, errorMessage, items, paginatedItems, currentPage, totalPages, pickFirst, formatDateTime, setCurrentPage } =
    useNotifications();

  return (
    <div className="space-y-8 font-poppins text-[#222D33]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifikasi</h1>
          <p className="mt-1 text-gray-500">
            Konfirmasi otomatis ketika setoranmu telah sukses diangkut dan diselesaikan.
          </p>
        </div>
      </div>

      <NotificationSummaryCards totalItems={items.length} />

      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {errorMessage}
        </div>
      )}

      <NotificationList
        loading={loading}
        items={paginatedItems}
        currentPage={currentPage}
        totalPages={totalPages}
        pickFirst={pickFirst}
        formatDateTime={formatDateTime}
        onOpenRiwayat={() => router.push("/user/riwayat")}
        onPrevPage={() => setCurrentPage((prev) => prev - 1)}
        onNextPage={() => setCurrentPage((prev) => prev + 1)}
      />
    </div>
  );
}
