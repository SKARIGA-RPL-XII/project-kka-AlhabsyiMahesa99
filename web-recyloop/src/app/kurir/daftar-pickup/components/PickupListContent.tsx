import { ArrowRight, Calendar, MapPin, Package, StickyNote, Weight } from "lucide-react";
import { PickupListRow } from "../hooks/usePickupList";
import { formatDateOnly } from "../../shared/utils/formatDate";
import { pickFirstRelation } from "../../shared/utils/pickFirstRelation";
type Props = {
  pickups: PickupListRow[];
  hasScheduledTask: boolean;
  takingTaskId: string | null;
  onTakeTask: (pickupId: string) => void;
};

export function PickupListContent({ pickups, hasScheduledTask, takingTaskId, onTakeTask }: Props) {
  if (pickups.length === 0) {
    return (
      <div className="space-y-4">
        {hasScheduledTask && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
            Kamu masih punya tugas aktif. Selesaikan dulu sebelum ambil jemputan baru.
          </div>
        )}
        <div className="flex h-64 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50">
          <Package size={48} className="mb-4 text-gray-300" />
          <p className="font-medium text-gray-500">Belum ada permintaan jemputan saat ini.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {hasScheduledTask && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
          Kamu masih punya tugas aktif. Tombol ambil tugas dikunci sampai tugas sekarang selesai.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pickups.map((item) => (
        (() => {
          const profile = pickFirstRelation(item.profiles);

          return (
        <div
          key={item.id}
          className="group flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-lg"
        >
          <div className="relative h-48 w-full bg-gray-100">
            {item.image_url ? (
              <img src={item.image_url} alt="Sampah" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-gray-400">
                <Package size={32} />
                <span className="mt-2 text-xs">Tanpa Foto</span>
              </div>
            )}
            <div className="absolute left-4 top-4">
              <span className="rounded-full bg-blue-600 px-3 py-1 text-[10px] font-bold uppercase text-white">
                ID: {item.id.slice(0, 5)}
              </span>
            </div>
          </div>

          <div className="flex flex-1 flex-col p-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold capitalize text-gray-800">{profile?.full_name || "Anonim"}</h3>
              <div className="mt-2 flex items-start text-sm text-gray-500">
                <MapPin size={16} className="mr-2 mt-0.5 shrink-0 text-red-500" />
                <span className="line-clamp-2">{item.pickup_address || "Alamat tidak tersedia"}</span>
              </div>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-3">
                <div className="mb-1 flex items-center text-sm font-bold uppercase text-blue-400">
                  <Weight size={12} className="mr-1" /> Est. Berat
                </div>
                <p className="font-bold text-blue-700">{item.estimated_weight || 0} Kg</p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
                <div className="mb-1 flex items-center text-sm font-bold uppercase text-gray-400">
                  <Calendar size={12} className="mr-1" /> Tanggal
                </div>
                <p className="text-sm font-bold text-gray-700">{formatDateOnly(item.created_at)}</p>
              </div>
            </div>

            <div className="mb-6 flex-1">
              <div className="mb-1 flex items-center text-[10px] font-bold uppercase text-gray-400">
                <StickyNote size={12} className="mr-1" /> Catatan User
              </div>
              <p className="text-sm italic text-gray-600">"{item.notes || "Tidak ada catatan khusus"}"</p>
            </div>

            <button
              onClick={() => onTakeTask(item.id)}
              disabled={hasScheduledTask || takingTaskId === item.id}
              className="flex w-full cursor-pointer items-center justify-center rounded-2xl bg-gray-900 py-4 font-bold text-white transition-all active:scale-95 group-hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
            >
              {takingTaskId === item.id ? "Mengambil..." : "Ambil Tugas"} <ArrowRight size={18} className="ml-2" />
            </button>
          </div>
        </div>
          );
        })()
        ))}
      </div>
    </div>
  );
}
