import { PickupStatus } from "@/types/pickup";

const STATUS_LABEL: Record<PickupStatus, string> = {
  pending: "Pending",
  scheduled: "Scheduled",
  picked_up: "Picked Up",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATUS_STYLES: Record<PickupStatus, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-100",
  scheduled: "bg-blue-50 text-blue-700 border-blue-100",
  picked_up: "bg-purple-50 text-purple-700 border-purple-100",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
  cancelled: "bg-rose-50 text-rose-700 border-rose-100",
};

export function StatusBadge({ status }: { status: PickupStatus }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}