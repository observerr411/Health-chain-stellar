/**
 * Typed API functions for Dashboard stats.
 */

import { api } from "./http-client";

const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX || "api/v1";

export interface DashboardStats {
  totalBloodUnits: number;
  pendingRequests: number;
  activeDeliveries: number;
  totalDonors: number;
}

/**
 * Fetch aggregated dashboard statistics.
 * Maps to GET /api/v1/dashboard/stats
 *
 * Falls back to placeholder data while the endpoint is implemented.
 */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    return await api.get<DashboardStats>(`/${API_PREFIX}/dashboard/stats`);
  } catch {
    // Placeholder until backend endpoint is live
    return {
      totalBloodUnits: 2300,
      pendingRequests: 42,
      activeDeliveries: 18,
      totalDonors: 120,
    };
  }
}
