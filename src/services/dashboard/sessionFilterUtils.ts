
import { DashboardData } from "./types";

// Apply session type filter to dashboard data
export const applySessionFilter = (
  data: DashboardData,
  sessionType?: string
): DashboardData => {
  let filteredData = { ...data };
  
  // Filter based on session type
  if (sessionType && sessionType !== "all" && filteredData.sessionTypeData) {
    const sessionData = filteredData.sessionTypeData[sessionType];
    if (sessionData) {
      filteredData.summary.revenue.total = sessionData.revenue;
      filteredData.summary.bookings.total = sessionData.bookings;
      filteredData.summary.occupancy.rate = sessionData.occupancy;
    }
  }
  
  return filteredData;
};
