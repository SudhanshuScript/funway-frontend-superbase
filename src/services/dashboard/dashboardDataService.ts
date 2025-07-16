
import { mockDashboardData } from "./mockData";
import { applyDateFilter } from "./dateFilterUtils";
import { applyLocationFilter } from "./locationFilterUtils";
import { applySessionFilter } from "./sessionFilterUtils";
import { applyRoleFilter } from "./roleFilterUtils";
import { DashboardData, DashboardDataParams } from "./types";

// Re-export all types from the types file
export * from "./types";

/**
 * Get dashboard data based on various filters
 */
export const getDashboardData = (
  userRole: string,
  franchiseId?: string,
  dateFilter = "today",
  viewType = "overview",
  location = "global",
  country?: string,
  city?: string,
  sessionType?: string,
  sortBy?: string
): DashboardData => {
  // Start with complete data
  let filteredData = { ...mockDashboardData };

  // Apply filters sequentially
  filteredData = applyRoleFilter(filteredData, userRole, franchiseId);
  filteredData = applyDateFilter(filteredData, dateFilter);
  filteredData = applyLocationFilter(filteredData, location, country, city);
  filteredData = applySessionFilter(filteredData, sessionType);
  
  return filteredData;
};

/**
 * Enhanced function with a single params object for better maintainability
 */
export const getDashboardDataWithParams = (params: DashboardDataParams): DashboardData => {
  return getDashboardData(
    params.userRole,
    params.franchiseId,
    params.dateFilter,
    params.viewType,
    params.location,
    params.country,
    params.city,
    params.sessionType,
    params.sortBy
  );
};
