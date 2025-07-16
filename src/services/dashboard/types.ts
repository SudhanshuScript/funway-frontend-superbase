
// Define all dashboard-related types
export type DateFilterType = "today" | "week" | "month" | "quarter" | "year" | "custom";
export type ViewType = "overview" | "franchise" | "operational";
export type LocationType = "global" | "country" | "city" | "franchise";

// Define the status types for better type safety
export type FranchiseStatusType = "high" | "medium" | "low";
export type CoinStatusType = "good" | "warning" | "critical";
export type AlertType = "warning" | "critical";

// Dashboard data interfaces
export interface RevenueData {
  total: number;
  change: number;
  breakdown?: {
    online: number;
    walkIn: number;
  };
  previousPeriod?: number;
}

export interface BookingsData {
  total: number;
  change: number;
  online: number;
  walkIn: number;
}

export interface OccupancyData {
  rate: number;
  change: number;
  franchiseBreakdown?: Array<{
    name: string;
    rate: number;
  }>;
}

export interface SatisfactionData {
  score: number;
  change: number;
  totalReviews: number;
  positive: number;
  neutral: number;
  negative: number;
}

export interface FranchisesData {
  active: number;
  total: number;
}

export interface GuestsData {
  today: number;
  week: number;
  change: number;
  new?: number;
  returning?: number;
}

export interface DashboardSummary {
  revenue: RevenueData;
  bookings: BookingsData;
  occupancy: OccupancyData;
  satisfaction: SatisfactionData;
  franchises?: FranchisesData;
  guests: GuestsData;
}

export interface RevenueTrend {
  name: string;
  revenue: number;
  lastPeriod: number;
}

export interface FranchisePerformance {
  name: string;
  revenue: number;
  satisfaction: number;
}

export interface BookingDistribution {
  name: string;
  value: number;
}

export interface PaymentStatus {
  name: string;
  value: number;
}

export interface OfferUtilization {
  name: string;
  value: number;
}

export interface FranchiseOccupancy {
  name: string;
  rate: number;
  status: FranchiseStatusType;
}

export interface CoinUsage {
  franchise: string;
  balance: number;
  used: number;
  status: CoinStatusType;
}

export interface Alert {
  type: AlertType;
  message: string;
}

export interface OperationalMetrics {
  bookings: {
    confirmed: number;
    pending: number;
    cancelled: number;
    total: number;
  };
  occupancy: {
    current: number;
    target: number;
    franchises: FranchiseOccupancy[];
  };
  payments: {
    paid: number;
    pending: number;
    failed: number;
    refunded: number;
    total: number;
  };
  feedback: {
    average: number;
    positive: number;
    neutral: number;
    negative: number;
    total: number;
  };
  coinUsage: CoinUsage[];
  realTimeMetrics: {
    checkIns: number;
    staffPresent: number;
    alerts: Alert[];
  };
}

export interface CountryData {
  code: string;
  name: string;
  revenue: number;
  bookings: number;
  satisfaction: number;
  franchises: number;
}

export interface CityData {
  name: string;
  revenue: number;
  bookings: number;
  satisfaction: number;
}

export interface SessionTypeData {
  revenue: number;
  bookings: number;
  occupancy: number;
}

export interface DashboardData {
  summary: DashboardSummary;
  revenueTrends: RevenueTrend[];
  topFranchises: FranchisePerformance[];
  bookingDistribution: BookingDistribution[];
  paymentStatus: PaymentStatus[];
  offerUtilization: OfferUtilization[];
  operationalMetrics: OperationalMetrics;
  countryData?: CountryData[];
  cityData?: Record<string, CityData[]>;
  sessionTypeData?: Record<string, SessionTypeData>;
}

// Parameters for getting dashboard data
export interface DashboardDataParams {
  userRole: string;
  franchiseId?: string;
  dateFilter: DateFilterType;
  viewType: ViewType;
  location: LocationType;
  country?: string;
  city?: string;
  sessionType?: string;
  sortBy?: string;
}
