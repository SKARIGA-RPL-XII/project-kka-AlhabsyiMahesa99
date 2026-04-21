"use client";

export const adminQueryKeys = {
  dashboard: {
    all: ["admin-dashboard"] as const,
    detail: (scope: string) => ["admin-dashboard", scope] as const,
  },
  setoran: {
    all: ["admin-setoran"] as const,
    list: (page: number, status: string) => ["admin-setoran", page, status] as const,
  },
  reward: {
    all: ["admin-reward"] as const,
    catalog: ["admin-reward", "catalog"] as const,
    categories: ["admin-reward", "categories"] as const,
    transactions: (page: number) => ["admin-reward", "transactions", page] as const,
    audit: (scope: string) => ["admin-reward", "audit", scope] as const,
  },
  users: {
    all: ["admin-users"] as const,
    list: (role: string) => ["admin-users", role] as const,
  },
  master: {
    all: ["admin-master"] as const,
    categories: ["admin-master", "categories"] as const,
    totalVolume: ["admin-master", "total-volume"] as const,
  },
  laporan: {
    all: ["admin-laporan"] as const,
    report: (periodType: string, year: number, month: number) => ["admin-laporan", periodType, year, month] as const,
  },
};
