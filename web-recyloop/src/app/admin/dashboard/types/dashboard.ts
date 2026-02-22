export type DashboardStats = {
  totalUsers: number;
  pendingPickups: number;
  totalWasteKg: number;
  totalPointsSpent: number;
};

export type RecentPickupRow = {
  id: string;
  status: string | null;
  estimated_weight: number | null;
  total_weight: number | null;
  user: { full_name: string | null } | { full_name: string | null }[] | null;
  kategori: { name: string | null } | { name: string | null }[] | null;
};

export type RecentPickupItem = {
  id: string;
  displayId: string;
  status: string | null;
  customerName: string;
  categoryName: string;
  weightKg: number;
};
