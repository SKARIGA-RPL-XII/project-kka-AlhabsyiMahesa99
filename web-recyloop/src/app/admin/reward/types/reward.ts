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
  is_active: boolean;
  image_url: string | null;
  created_at: string;
};

export type RedemptionRow = {
  id: string;
  points_spent: number;
  amount_added: number;
  status: string;
  fulfillment_status: string | null;
  fulfillment_code: string | null;
  created_at: string;
  profile: {
    full_name: string | null;
    email: string | null;
  } | null;
  reward: {
    title: string;
    reward_category: string | null;
  } | null;
};

type ProfileRelation = {
  full_name: string | null;
  email: string | null;
};

type RewardRelation = {
  title: string;
  reward_category: string | null;
};

export type RedemptionQueryRow = {
  id: string;
  points_spent: number;
  amount_added: number;
  status: string;
  fulfillment_status: string | null;
  fulfillment_code: string | null;
  created_at: string;
  profiles: ProfileRelation | ProfileRelation[] | null;
  rewards: RewardRelation | RewardRelation[] | null;
};

export type AuditSummary = {
  pointsSpent: number;
  amountAdded: number;
  totalTx: number;
};
