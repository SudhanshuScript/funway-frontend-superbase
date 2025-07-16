
import { DashboardData } from "./types";

// Apply date filter to dashboard data
export const applyDateFilter = (
  data: DashboardData, 
  dateFilter: string
): DashboardData => {
  let filteredData = { ...data };
  
  // Filter based on date
  if (dateFilter === "today") {
    // Simulate daily data with reduced numbers
    filteredData.summary.revenue.total = filteredData.revenueTrends[6].revenue; // Sunday data
    filteredData.summary.bookings.total = 42;
    filteredData.summary.bookings.online = 32;
    filteredData.summary.bookings.walkIn = 10;
    filteredData.summary.guests.today = 68;
  } else if (dateFilter === "week") {
    // Use weekly data (default)
  } else if (dateFilter === "month") {
    // Simulate monthly data with increased numbers
    filteredData.summary.revenue.total = 48500;
    filteredData.summary.revenue.change = 12.8;
    filteredData.summary.bookings.total = 985;
    filteredData.summary.bookings.online = 740;
    filteredData.summary.bookings.walkIn = 245;
    filteredData.summary.guests.week = 1845;
  } else if (dateFilter === "quarter") {
    // Simulate quarterly data
    filteredData.summary.revenue.total = 145000;
    filteredData.summary.revenue.change = 15.2;
    filteredData.summary.bookings.total = 2950;
    filteredData.summary.bookings.online = 2220;
    filteredData.summary.bookings.walkIn = 730;
    filteredData.summary.guests.week = 5535;
  } else if (dateFilter === "year") {
    // Simulate yearly data
    filteredData.summary.revenue.total = 580000;
    filteredData.summary.revenue.change = 22.5;
    filteredData.summary.bookings.total = 11800;
    filteredData.summary.bookings.online = 8850;
    filteredData.summary.bookings.walkIn = 2950;
    filteredData.summary.guests.week = 22140;
  }
  
  return filteredData;
};
