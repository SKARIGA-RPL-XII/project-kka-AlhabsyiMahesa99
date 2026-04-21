import { HistoryRow, HistoryStatus } from "../hooks/useCourierHistory";
import { formatDateTime } from "../../shared/utils/formatDate";
import { pickFirstRelation } from "../../shared/utils/pickFirstRelation";

export function pickFirst<T,>(value: T | T[] | null | undefined): T | null {
  return pickFirstRelation(value);
}

export function statusLabel(status: HistoryStatus) {
  return status === "completed" ? "Selesai" : "Proses Kirim";
}

export function statusBadgeClass(status: HistoryStatus) {
  return status === "completed"
    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
    : "bg-blue-50 text-blue-700 ring-1 ring-blue-100";
}

export function formatDate(value: string) {
  return formatDateTime(value);
}

export function formatPickupId(id: string) {
  return `REC-${id.slice(0, 5).toUpperCase()}`;
}

export function formatWeight(item: HistoryRow) {
  const weight = item.total_weight ?? item.estimated_weight ?? 0;
  return `${weight.toLocaleString("id-ID")} Kg`;
}
