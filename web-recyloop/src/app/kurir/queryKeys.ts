"use client";

export const kurirQueryKeys = {
  profile: {
    all: ["kurir-profile"] as const,
    detail: (scope: string) => ["kurir-profile", scope] as const,
  },
  dashboard: {
    all: ["kurir-dashboard"] as const,
    detail: (scope: string) => ["kurir-dashboard", scope] as const,
  },
  pickupList: {
    all: ["kurir-pickup-list"] as const,
    detail: (scope: string) => ["kurir-pickup-list", scope] as const,
  },
  activeTask: {
    all: ["kurir-active-task"] as const,
    detail: (scope: string) => ["kurir-active-task", scope] as const,
  },
  riwayat: {
    all: ["kurir-riwayat"] as const,
    list: (page: number, status: string, search: string) => ["kurir-riwayat", page, status, search] as const,
    summary: (scope: string) => ["kurir-riwayat", "summary", scope] as const,
  },
};
