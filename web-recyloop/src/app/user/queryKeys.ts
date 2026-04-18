"use client";

export const userQueryKeys = {
  profile: {
    all: ["user-profile"] as const,
    detail: (scope: string) => ["user-profile", scope] as const,
  },
  dashboard: {
    all: ["user-dashboard"] as const,
    detail: (scope: string) => ["user-dashboard", scope] as const,
  },
  riwayat: {
    all: ["user-riwayat"] as const,
    list: (currentPage: number, activeStatus: string) => ["user-riwayat", currentPage, activeStatus] as const,
  },
  setor: {
    all: ["user-setor"] as const,
    list: (currentPage: number) => ["user-setor", currentPage] as const,
  },
  reward: {
    all: ["user-reward"] as const,
    bootstrap: ["user-reward", "bootstrap"] as const,
    history: (page: number) => ["user-reward", "history", page] as const,
  },
  notifications: {
    all: ["user-notifications"] as const,
    list: (scope: string) => ["user-notifications", scope] as const,
  },
  wasteCategories: {
    all: ["waste-categories"] as const,
  },
  pickupAddress: {
    all: ["user-pickup-address"] as const,
  },
};
