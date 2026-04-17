import { LucideIcon } from "lucide-react";

export type PickupActivityRow = {
  id: string;
  created_at: string;
  status: string | null;
  total_points_earned: number | null;
  total_weight: number | null;
  estimated_weight: number | null;
  waste_category: { name: string | null } | { name: string | null }[] | null;
};

export type DashboardStatItem = {
  title: string;
  value: string;
  unit: string;
  icon: LucideIcon;
  color: string;
  bg: string;
};

export type DashboardActivityItem = {
  id: string;
  title: string;
  time: string;
  pointsText: string;
  statusText: string;
  statusClass: string;
};
