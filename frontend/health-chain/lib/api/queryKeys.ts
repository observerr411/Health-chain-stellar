

import type { OrderQueryParams } from "@/lib/types/orders";

export const queryKeys = {

  orders: {
    all: ["orders"] as const,
    list: (params: OrderQueryParams) => ["orders", "list", params] as const,
  },

  /**
   * Blood Banks
   */
  bloodBanks: {
    /** Availability for a given blood type + hospital */
    availability: (bloodType: string, hospitalId: string) =>
      ["bloodBanks", "availability", bloodType, hospitalId] as const,
  },

  /**
   * Dashboard
   */
  dashboard: {
    stats: ["dashboard", "stats"] as const,
  },
} as const;
