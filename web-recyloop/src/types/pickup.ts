export type PickupStatus = "pending" | "scheduled" | "picked_up" | "completed" | "cancelled";

export interface PickupItem {
  rawId: string;
  userId: string;
  id: string; // Format REC-XXXXX
  createdAt: string;
  customerName: string;
  customerPhone: string;
  category: string;
  pointsPerKg: number;
  estimatedWeight: number;
  finalWeight?: number;
  points: number;
  status: PickupStatus;
  address: string;
  notes?: string;
  courierName?: string;
  courierPhone?: string;
}

// Ini untuk mapping data dari Supabase (Snake Case)
export interface PickupRow {
  id: string;
  user_id: string;
  created_at: string;
  status: PickupStatus;
  total_weight: number | null;
  total_points_earned: number | null;
  pickup_address: string | null;
  estimated_weight: number | null;
  notes: string | null;
  user: { full_name: string | null; phone: string | null } | null;
  kurir: { full_name: string | null; phone: string | null } | null;
  kategori: { name: string | null; points_per_kg: number | null } | null;
}