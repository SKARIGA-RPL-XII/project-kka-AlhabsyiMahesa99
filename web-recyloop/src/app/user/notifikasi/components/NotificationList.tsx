import { Bell, CheckCircle2, MapPin, Recycle } from "lucide-react";
import { CompletedPickupNotification } from "../hooks/notificationQueries";

type Props = {
  loading: boolean;
  items: CompletedPickupNotification[];
  currentPage: number;
  totalPages: number;
  pickFirst: <T,>(value: T | T[] | null | undefined) => T | null;
  formatDateTime: (value: string | null) => string;
  onOpenRiwayat: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
};

export function NotificationList({
  loading,
  items,
  currentPage,
  totalPages,
  pickFirst,
  formatDateTime,
  onOpenRiwayat,
  onPrevPage,
  onNextPage,
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="inline-flex items-center gap-2 text-lg font-bold">
          <Bell size={18} className="text-[#299E63]" />
          Notifikasi Selesai
        </h3>

        <button onClick={onOpenRiwayat} className="cursor-pointer text-sm font-semibold text-[#299E63] hover:underline">
          Lihat Riwayat
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">Memuat notifikasi...</div>
        ) : items.length === 0 ? (
          <div className="rounded-xl bg-gray-50 p-6 text-sm italic text-gray-500">
            Belum ada notifikasi selesai. Setor sampah dulu yuk.
          </div>
        ) : (
          items.map((item) => {
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
                      ID: <span className="font-semibold">REC-{item.id.slice(0, 5).toUpperCase()}</span> -{" "}
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

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
          <p className="text-sm text-gray-500">
            Halaman {currentPage} dari {totalPages}
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={onPrevPage}
              className="cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Prev
            </button>
            <span className="px-2 text-sm text-gray-500">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={onNextPage}
              className="cursor-pointer rounded-lg border border-[#299E63] bg-[#299E63] px-4 py-2 text-sm font-semibold text-white hover:bg-[#238b56] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
