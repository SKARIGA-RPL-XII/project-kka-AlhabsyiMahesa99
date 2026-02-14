import { Clock3, MapPin, PackageSearch, Phone, Truck, UserRound, Weight, XCircle } from "lucide-react";
import { PickupItem } from "@/types/pickup";
import { StatusBadge } from "./StatusBadge";
import { formatDateTime } from "../utils/format";

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 p-3">
      <p className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-gray-400">
        {icon}
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-700">{value}</p>
    </div>
  );
}

export function DetailModal({
  selectedItem,
  validatedWeight,
  setValidatedWeight,
  previewFinalPoints,
  updating,
  onClose,
  onComplete,
}: {
  selectedItem: PickupItem | null;
  validatedWeight: string;
  setValidatedWeight: (value: string) => void;
  previewFinalPoints: number;
  updating: boolean;
  onClose: () => void;
  onComplete: (item: PickupItem) => void;
}) {
  if (!selectedItem) return null;

  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={onClose}>
      <div
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-[#222D33]">Detail Setoran</h2>
            <p className="text-xs text-gray-400">{selectedItem.id}</p>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <XCircle size={18} />
          </button>
        </div>

        <div className="grid gap-4 overflow-y-auto p-6 md:grid-cols-2">
          <DetailRow icon={<UserRound size={15} />} label="Nama User" value={selectedItem.customerName} />
          <DetailRow icon={<Phone size={15} className="text-gray-400" />} label="Telepon" value={selectedItem.customerPhone} />
          <DetailRow icon={<PackageSearch size={15} />} label="Kategori" value={selectedItem.category} />
          <DetailRow icon={<Clock3 size={15} />} label="Waktu Request" value={formatDateTime(selectedItem.createdAt)} />

          <div className="rounded-xl border border-gray-100 p-3">
            <p className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-gray-400">
              <Weight size={15} />
              Berat Estimasi
            </p>
            <p className="text-sm font-semibold text-gray-700">{selectedItem.estimatedWeight} Kg</p>
          </div>

          <div className="rounded-xl border border-gray-100 p-3">
            <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-gray-400">Status</p>
            <div className="mt-2">
              <StatusBadge status={selectedItem.status} />
            </div>
          </div>

          <div className="md:col-span-2 rounded-xl border border-gray-100 p-3">
            <p className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-gray-400">
              <MapPin size={13} />
              Alamat Pickup
            </p>
            <p className="text-sm font-medium text-gray-700">{selectedItem.address}</p>
          </div>

          <div className="md:col-span-2 rounded-xl border border-gray-100 p-3">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-gray-400">Catatan</p>
            <p className="text-sm text-gray-600">{selectedItem.notes || "Tidak ada catatan"}</p>
          </div>

          {selectedItem.courierName && (
            <div className="md:col-span-2 rounded-xl border border-blue-100 bg-blue-50 p-3">
              <p className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-blue-500">
                <Truck size={13} />
                Kurir Bertugas
              </p>
              <p className="text-sm font-semibold text-blue-800">{selectedItem.courierName}</p>
              <p className="text-xs text-blue-600">{selectedItem.courierPhone}</p>
            </div>
          )}

          {selectedItem.status === "picked_up" && (
            <div className="md:col-span-2 rounded-xl border border-[#299E63]/20 bg-[#299E63]/5 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[#299E63]">Validasi Gudang Admin</p>

              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-gray-500">Berat Final (Kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={validatedWeight}
                    onChange={(e) => setValidatedWeight(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-black outline-none focus:border-[#299E63] focus:ring-2 focus:ring-[#299E63]/20"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-gray-500">Estimasi Poin Final</label>
                  <div className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-bold text-[#299E63]">
                    {previewFinalPoints.toLocaleString("id-ID")} poin
                  </div>
                  <p className="mt-1 text-[11px] text-gray-400">Rumus: berat final x {selectedItem.pointsPerKg} poin/kg</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-gray-100 px-6 py-4">
          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="cursor-pointer rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Tutup
            </button>

            {selectedItem.status === "picked_up" && (
              <button
                onClick={() => onComplete(selectedItem)}
                disabled={updating}
                className="cursor-pointer rounded-xl bg-[#299E63] px-4 py-2 text-sm font-bold text-white hover:bg-[#238b56] disabled:opacity-50"
              >
                {updating ? "Memproses..." : "Mark Completed"}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}