import { UserRole } from "@/providers/UserRoleProvider";

export type DateFilterType = "today" | "week" | "month" | "quarter" | "year" | "custom";
export type ViewType = "overview" | "franchise" | "operational";
export type LocationType = "global" | "country" | "city" | "franchise";

// Define the status types for better type safety
export type FranchiseStatusType = "high" | "medium" | "low";
export type CoinStatusType = "good" | "warning" | "critical";
export type AlertType = "warning" | "critical";

// Mock data that would normally come from an API
const mockData = {
  summary: {
    revenue: {
      total: 12546,
      change: 8.2,
      breakdown: {
        online: 9780,
        walkIn: 2766
      }
    },
    bookings: {
      total: 248,
      change: 12.5,
      online: 186,
      walkIn: 62
    },
    occupancy: {
      rate: 76,
      change: 4.3
    },
    satisfaction: {
      score: 4.8,
      change: 0.3,
      totalReviews: 120,
      positive: 98,
      neutral: 18,
      negative: 4
    },
    franchises: {
      active: 8,
      total: 10
    },
    guests: {
      today: 68,
      week: 412,
      change: 15.2,
      new: 42,
      returning: 26
    }
  },
  
  // Revenue data for line chart
  revenueTrends: [
    { name: "Mon", revenue: 2400, lastPeriod: 2000 },
    { name: "Tue", revenue: 1398, lastPeriod: 1800 },
    { name: "Wed", revenue: 9800, lastPeriod: 8200 },
    { name: "Thu", revenue: 3908, lastPeriod: 3780 },
    { name: "Fri", revenue: 4800, lastPeriod: 4500 },
    { name: "Sat", revenue: 7800, lastPeriod: 6800 },
    { name: "Sun", revenue: 4300, lastPeriod: 3900 },
  ],
  
  // Franchise data for bar chart
  topFranchises: [
    { name: "SkyBistro Central", revenue: 4800, satisfaction: 4.9 },
    { name: "FunWay East", revenue: 3900, satisfaction: 4.7 },
    { name: "FunWay West", revenue: 3500, satisfaction: 4.5 },
    { name: "SkyBistro North", revenue: 2800, satisfaction: 4.8 },
    { name: "SkyBistro Airport", revenue: 1900, satisfaction: 4.6 }
  ],
  
  // Booking status data for pie chart
  bookingDistribution: [
    { name: "Confirmed", value: 185 },
    { name: "Pending", value: 42 },
    { name: "Cancelled", value: 21 }
  ],
  
  // Payment data for bar chart
  paymentStatus: [
    { name: "Paid", value: 192 },
    { name: "Pending", value: 38 },
    { name: "Failed", value: 18 },
    { name: "Refunded", value: 3 }
  ],
  
  // Offer data for pie chart
  offerUtilization: [
    { name: "Used", value: 156 },
    { name: "Unused", value: 44 }
  ],
  
  // Operational data
  operationalMetrics: {
    bookings: {
      confirmed: 42,
      pending: 8,
      cancelled: 3,
      total: 53
    },
    occupancy: {
      current: 68,
      target: 85,
      franchises: [
        { name: "SkyBistro Central", rate: 92, status: "high" as FranchiseStatusType },
        { name: "FunWay East", rate: 75, status: "medium" as FranchiseStatusType },
        { name: "SkyBistro North", rate: 45, status: "low" as FranchiseStatusType }
      ]
    },
    payments: {
      paid: 38,
      pending: 12,
      failed: 3,
      refunded: 3,
      total: 56
    },
    feedback: {
      average: 4.6,
      positive: 38,
      neutral: 10,
      negative: 5,
      total: 53
    },
    coinUsage: [
      { franchise: "SkyBistro Central", balance: 245, used: 180, status: "good" as CoinStatusType },
      { franchise: "FunWay East", balance: 120, used: 95, status: "good" as CoinStatusType },
      { franchise: "SkyBistro North", balance: 30, used: 250, status: "warning" as CoinStatusType },
      { franchise: "FunWay West", balance: 10, used: 115, status: "critical" as CoinStatusType },
      { franchise: "SkyBistro Airport", balance: 150, used: 85, status: "good" as CoinStatusType }
    ],
    realTimeMetrics: {
      checkIns: 24,
      staffPresent: 8,
      alerts: [
        { type: "warning" as AlertType, message: "SkyBistro North is reaching full capacity (85%)" },
        { type: "critical" as AlertType, message: "Staff shortage at FunWay East location" },
        { type: "warning" as AlertType, message: "High cancellation spike in last 24h at SkyBistro Central" }
      ]
    }
  },
  
  // Country-specific data for superadmin view
  countryData: [
    { 
      code: "us", 
      name: "United States", 
      revenue: 8500, 
      bookings: 120, 
      satisfaction: 4.6, 
      franchises: 4 
    },
    { 
      code: "ca", 
      name: "Canada", 
      revenue: 6200, 
      bookings: 98, 
      satisfaction: 4.8, 
      franchises: 2 
    },
    { 
      code: "uk", 
      name: "United Kingdom", 
      revenue: 7800, 
      bookings: 110, 
      satisfaction: 4.7, 
      franchises: 3 
    },
    { 
      code: "in", 
      name: "India", 
      revenue: 4500, 
      bookings: 82, 
      satisfaction: 4.5, 
      franchises: 3 
    }
  ],
  
  // City-specific data for detailed view
  cityData: {
    "us": [
      { name: "New York", revenue: 3200, bookings: 48, satisfaction: 4.7 },
      { name: "Los Angeles", revenue: 2800, bookings: 42, satisfaction: 4.6 },
      { name: "Chicago", revenue: 2500, bookings: 30, satisfaction: 4.5 }
    ],
    "ca": [
      { name: "Toronto", revenue: 3800, bookings: 58, satisfaction: 4.8 },
      { name: "Vancouver", revenue: 2400, bookings: 40, satisfaction: 4.7 }
    ],
    "uk": [
      { name: "London", revenue: 4200, bookings: 62, satisfaction: 4.8 },
      { name: "Manchester", revenue: 2100, bookings: 32, satisfaction: 4.6 },
      { name: "Birmingham", revenue: 1500, bookings: 16, satisfaction: 4.5 }
    ]
  },
  
  // Session type data
  sessionTypeData: {
    "regular": {
      revenue: 8500,
      bookings: 182,
      occupancy: 72
    },
    "special": {
      revenue: 4046,
      bookings: 66,
      occupancy: 85
    }
  }
};

// Function to filter data based on user role and filters
export const getDashboardData = (
  userRole: UserRole,
  franchiseId: string | undefined,
  dateFilter: DateFilterType,
  viewType: ViewType,
  location: LocationType,
  country?: string,
  city?: string,
  sessionType?: string,
  sortBy?: string
) => {
  // Start with complete data
  let filteredData = { ...mockData };
  
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
  
  // Filter based on location type
  if (location === "country" && country) {
    // Filter data for specific country
    const countryInfo = filteredData.countryData.find(c => c.code === country);
    if (countryInfo) {
      filteredData.summary.revenue.total = countryInfo.revenue;
      filteredData.summary.bookings.total = countryInfo.bookings;
      filteredData.summary.satisfaction.score = countryInfo.satisfaction;
    }
  } else if (location === "city" && country && city) {
    // Filter data for specific city
    const cityInfo = filteredData.cityData[country as keyof typeof filteredData.cityData]?.find(c => c.name === city);
    if (cityInfo) {
      filteredData.summary.revenue.total = cityInfo.revenue;
      filteredData.summary.bookings.total = cityInfo.bookings;
      filteredData.summary.satisfaction.score = cityInfo.satisfaction;
    }
  }
  
  // Filter based on session type
  if (sessionType && sessionType !== "all") {
    const sessionData = filteredData.sessionTypeData[sessionType as keyof typeof filteredData.sessionTypeData];
    if (sessionData) {
      filteredData.summary.revenue.total = sessionData.revenue;
      filteredData.summary.bookings.total = sessionData.bookings;
      filteredData.summary.occupancy.rate = sessionData.occupancy;
    }
  }
  
  return filteredData;
};
