export type Reward = {
  id: number;
  title: string;
  description: string | null;
  reward_category: string;
  partner_name: string | null;
  redemption_note: string | null;
  fulfillment_type: "code" | "manual";
  points_required: number;
  amount_value: number;
  stock: number | null;
  image_url: string | null;
  is_active: boolean;
};

export type UserProfile = {
  id: string;
  full_name: string | null;
  total_points: number | null;
};

export type RewardRelation = {
  title: string;
  reward_category: string | null;
  partner_name: string | null;
  redemption_note: string | null;
  fulfillment_type: "code" | "manual" | null;
};

export type RedemptionHistory = {
  id: string;
  created_at: string;
  points_spent: number;
  amount_added: number;
  fulfillment_status: string | null;
  fulfillment_code: string | null;
  rewards: RewardRelation | RewardRelation[] | null;
};
