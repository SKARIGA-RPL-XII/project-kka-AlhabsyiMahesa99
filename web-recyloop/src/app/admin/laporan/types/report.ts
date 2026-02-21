export type PeriodType = "monthly" | "yearly";

export type RelationOrArray<T> = T | T[] | null;

export type ReportPickupRow = {
  id: string;
  created_at: string;
  status: string | null;
  total_weight: number | null;
  total_points_earned: number | null;
  estimated_weight: number | null;
  profiles: RelationOrArray<{ full_name: string | null; email: string | null }>;
};

export type ReportRedemptionRow = {
  id: string;
  created_at: string;
  points_spent: number;
  amount_added: number;
  status: string | null;
  fulfillment_status: string | null;
  profiles: RelationOrArray<{ full_name: string | null; email: string | null }>;
  rewards: RelationOrArray<{ title: string | null; reward_category: string | null }>;
};

export type ReportSummary = {
  totalPickups: number;
  completedPickups: number;
  totalWeight: number;
  totalPointsEarned: number;
  totalRedemptions: number;
  totalPointsSpent: number;
  totalAmountAdded: number;
};

export type ReportMessage = { type: "success" | "error"; text: string } | null;
