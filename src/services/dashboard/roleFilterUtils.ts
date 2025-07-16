
import { DashboardData } from "./types";

// Apply role-based filters to dashboard data
export const applyRoleFilter = (
  data: DashboardData,
  userRole: string,
  franchiseId?: string
): DashboardData => {
  let filteredData = { ...data };
  
  // Filter based on role
  if (userRole === "franchise_owner") {
    // Franchise owners only see their own franchise data
    if (franchiseId) {
      // In a real app, we'd filter by the actual franchiseId
      // For now, just simulate by filtering to the first franchise
      filteredData.topFranchises = filteredData.topFranchises.slice(0, 1);
      // Adjust summary data to represent only one franchise
      filteredData.summary.revenue.total = filteredData.topFranchises[0].revenue;
      filteredData.summary.revenue.change = 5.5;
      filteredData.summary.bookings.total = 68;
      filteredData.summary.bookings.online = 52;
      filteredData.summary.bookings.walkIn = 16;
      filteredData.summary.satisfaction.score = filteredData.topFranchises[0].satisfaction;
    }
  } else if (userRole === "franchise_manager") {
    // Managers only see daily operational data
    filteredData.revenueTrends = filteredData.revenueTrends.slice(-1); // Just today
    // Adjust summary data to represent only today
    filteredData.summary.revenue.total = filteredData.revenueTrends[0].revenue;
    filteredData.summary.bookings.total = 42;
    filteredData.summary.bookings.online = 32;
    filteredData.summary.bookings.walkIn = 10;
  }
  
  return filteredData;
};
