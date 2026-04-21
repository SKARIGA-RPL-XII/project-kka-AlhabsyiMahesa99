import { Clock3, MapPin, Phone, X } from "lucide-react";
import { HistoryRow } from "../hooks/useCourierHistory";
import { formatDate, formatPickupId, pickFirst, statusLabel } from "./historyUtils";

type Props = {
  selectedDetail: HistoryRow | null;
  onClose: () => void;
  onOpenImage: (imageUrl: string) => void;
};

export function HistoryDetailModal({ selectedDetail, onClose, onOpenImage }: Props) {
  if (!selectedDetail) return null;

  const user = pickFirst(selectedDetail.user);
  const imageUrl = selectedDetail.pickup_image_url;
  const imageTitle = `Foto pickup ${formatPickupId(selectedDetail.id)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative bg-slate-950">
          {imageUrl ? (
            <button type="button" onClick={() => onOpenImage(imageUrl)} className="group block w-full cursor-zoom-in">
              <img src={imageUrl} alt={imageTitle} className="h-64 w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent px-5 py-4 text-white">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-blue-100/90">Foto Pickup</p>
                  <p className="mt-1 text-sm font-semibold">{imageTitle}</p>
                </div>
                <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold backdrop-blur-sm">
                  Klik untuk perbesar
                </span>
              </div>
            </button>
          ) : (
            <div className="flex h-60 w-full items-center justify-center bg-slate-200 text-sm text-slate-500">Foto belum tersedia</div>
          )}

          <div className="absolute inset-x-0 top-0 flex justify-end p-4">
            <button
              onClick={onClose}
              className="cursor-pointer rounded-lg bg-white/80 p-2 text-slate-700 backdrop-blur hover:bg-white"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-5 px-5 py-5">
          <div>
            <h3 className="text-lg font-bold text-[#1D2B45]">Detail Riwayat {formatPickupId(selectedDetail.id)}</h3>
            <p className="text-xs text-slate-500">Ringkasan pickup yang sudah diproses kurir.</p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-semibold text-slate-800">{user?.full_name || "Pengguna"}</p>
              <p className="flex items-center gap-1 text-xs text-slate-500">
                <Phone size={13} />
                {user?.phone || "-"}
              </p>
            </div>

            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
              {statusLabel(selectedDetail.status)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-slate-400">Waktu Pickup</p>
              <p className="flex items-center gap-1 font-medium text-slate-700">
                <Clock3 size={14} />
                {formatDate(selectedDetail.created_at)}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Alamat</p>
              <p className="flex items-start gap-1 font-medium text-slate-700">
                <MapPin size={14} className="mt-0.5" />
                {selectedDetail.pickup_address || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Berat Estimasi</p>
              <p className="font-semibold text-slate-800">{(selectedDetail.estimated_weight || 0).toLocaleString("id-ID")} Kg</p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Berat Final</p>
              <p className="font-semibold text-slate-800">
                {selectedDetail.total_weight ? `${selectedDetail.total_weight.toLocaleString("id-ID")} Kg` : "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Poin</p>
              <p className="font-semibold text-blue-600">+{(selectedDetail.total_points_earned || 0).toLocaleString("id-ID")} poin</p>
            </div>
          </div>

          <div>
            <p className="mb-1 text-xs text-slate-400">Catatan</p>
            <p className="text-sm text-slate-600">{selectedDetail.notes || "Tidak ada catatan."}</p>
          </div>

          {selectedDetail.status === "completed" && selectedDetail.completed_at && (
            <div className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
              Pickup diselesaikan pada {formatDate(selectedDetail.completed_at)}.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
