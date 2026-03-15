import { PickupStatus } from "../types/riwayat";

export function pickFirst<T,>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export function statusLabel(status: PickupStatus) {
  if (status === "pending") return "Pending";
  if (status === "scheduled") return "Kurir Menuju Lokasi";
  if (status === "picked_up") return "Proses Timbang";
  if (status === "completed") return "Selesai";
  if (status === "cancelled") return "Dibatalkan";
  return "-";
}

export function statusBadgeClass(status: PickupStatus) {
  if (status === "pending") return "bg-orange-100 text-orange-700";
  if (status === "scheduled") return "bg-blue-100 text-blue-700";
  if (status === "picked_up") return "bg-purple-100 text-purple-700";
  if (status === "completed") return "bg-green-100 text-green-700";
  if (status === "cancelled") return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-700";
}

export function formatDate(value: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatPickupId(id: string) {
  return `REC-${id.slice(0, 5).toUpperCase()}`;
}
