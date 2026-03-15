export type PickupStatus = "pending" | "scheduled" | "picked_up" | "completed" | "cancelled";
export type StatusFilter = "all" | PickupStatus;

export type PickupRow = {
  id: string;
  created_at: string;
  status: PickupStatus;
  estimated_weight: number | null;
  total_weight: number | null;
  total_points_earned: number | null;
  pickup_address: string | null;
  notes: string | null;
  completed_at: string | null;
  waste_category: { name: string | null } | { name: string | null }[] | null;
  courier: { full_name: string | null; phone: string | null } | { full_name: string | null; phone: string | null }[] | null;
};

export type RiwayatSummary = {
  total: number;
  inProgress: number;
  done: number;
};
