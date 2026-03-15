import { Clock3, MapPin, Phone, User, Weight, X } from "lucide-react";
import { PickupRow, PickupStatus } from "../types/riwayat";
import { formatDate, formatPickupId, pickFirst } from "../utils/riwayatFormat";

type Props = {
  selectedDetail: PickupRow | null;
  onClose: () => void;
};

function renderTimeline(status: PickupStatus) {
  const steps = [
    { key: "pending", label: "Pending" },
    { key: "scheduled", label: "Kurir Menuju Lokasi" },
    { key: "picked_up", label: "Proses Timbang" },
    { key: "completed", label: "Selesai" },
  ] as const;

  const rank: Record<PickupStatus, number> = {
    pending: 1,
    scheduled: 2,
    picked_up: 3,
    completed: 4,
    cancelled: 0,
  };

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
      {steps.map((step) => {
        const active = rank[status] >= rank[step.key];
        return (
          <div
            key={step.key}
            className={`rounded-xl border px-3 py-2 text-xs font-semibold ${
              active ? "border-[#299E63] bg-green-50 text-[#299E63]" : "border-gray-200 bg-gray-50 text-gray-400"
            }`}
          >
            {step.label}
          </div>
        );
      })}
    </div>
  );
}

export function RiwayatDetailModal({ selectedDetail, onClose }: Props) {
  if (!selectedDetail) return null;

  const courier = pickFirst(selectedDetail.courier);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-[#222D33]">Detail Riwayat {formatPickupId(selectedDetail.id)}</h3>
            <p className="text-sm text-gray-500">Pantau progres jemputan dan validasi akhir.</p>
          </div>
          <button onClick={onClose} className="cursor-pointer rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          {renderTimeline(selectedDetail.status)}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">Waktu Request</p>
              <p className="inline-flex items-center gap-2 text-sm font-semibold">
                <Clock3 size={15} className="text-gray-400" />
                {formatDate(selectedDetail.created_at)}
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">Alamat Pickup</p>
              <p className="inline-flex items-start gap-2 text-sm font-semibold">
                <MapPin size={15} className="mt-0.5 shrink-0 text-gray-400" />
                {selectedDetail.pickup_address || "-"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-gray-100 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Berat Estimasi</p>
              <p className="mt-1 inline-flex items-center gap-2 text-sm font-bold">
                <Weight size={15} className="text-gray-400" />
                {(selectedDetail.estimated_weight || 0).toLocaleString("id-ID")} Kg
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Berat Final</p>
              <p className="mt-1 text-sm font-bold">
                {selectedDetail.total_weight ? `${selectedDetail.total_weight.toLocaleString("id-ID")} Kg` : "-"}
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Poin Final</p>
              <p className="mt-1 text-sm font-bold text-[#299E63]">
                +{(selectedDetail.total_points_earned || 0).toLocaleString("id-ID")} poin
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-blue-700">Kurir Bertugas</p>
            <div className="space-y-1 text-sm">
              <p className="inline-flex items-center gap-2 font-semibold text-blue-900">
                <User size={14} /> {courier?.full_name || "Belum ditentukan"}
              </p>
              <p className="inline-flex items-center gap-2 text-blue-700">
                <Phone size={14} /> {courier?.phone || "-"}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 p-4">
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-400">Catatan</p>
            <p className="text-sm text-gray-600">{selectedDetail.notes || "Tidak ada catatan."}</p>
          </div>

          {selectedDetail.status === "completed" && (
            <div className="rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-green-700">
              Setoran selesai pada {formatDate(selectedDetail.completed_at)}. Berat final sudah divalidasi kurir.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
