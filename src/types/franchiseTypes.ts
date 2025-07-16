
import { Franchise, FranchiseStatus, PaymentGateway } from "./franchise";

// Export type definitions properly for isolatedModules
export type { FranchiseStatus, PaymentGateway };

export type InactivityReason = "Payment Pending" | "Maintenance" | "Legal Issue" | "Owner Request" | null;

export interface PerformanceStats {
  monthly_revenue: number;
  daily_avg_revenue: number;
  customer_satisfaction: number;
  bookings: number;
  avg_booking_value: number;
  retention_rate: number;
  reviews_avg: number;
  reviews_count: number;
  revenue_trend: number[];
  booking_trend: number[];
  peak_hours: {
    hour: number;
    value: number;
  }[];
}

// Add missing types needed by components
export type OnboardingStep = 
  | "business-details" 
  | "contact-info" 
  | "tax-payment" 
  | "settings" 
  | "review";

export type GovernmentIDType = "PAN" | "Aadhar" | "Passport" | "Other";

export interface FranchisePerformance {
  revenue: number;
  customers: number;
  growth: number;
  reviewScore: number;
}

export type PerformanceType = {
  date: string;
  value: number;
};

// Dummy franchise and stats for development purposes
export const dummyFranchise: Franchise = {
  id: "dummy-franchise-id",
  name: "Demo Franchise",
  company_name: "Demo Franchise LLC",
  owner_name: "John Doe",
  contact_number: "+1 (555) 123-4567",
  email: "demo@example.com",
  address: "123 Main Street",
  city: "New York",
  state: "NY",
  country: "USA",
  tax_id: "123456789",
  tax_percentage: 8.5,
  tax_inclusive: false,
  payment_gateway: "Stripe",
  status: "active",
  default_currency: "USD",
  timezone: "America/New_York",
  language: "English",
};

export const dummyPerformanceStats: PerformanceStats = {
  monthly_revenue: 42500,
  daily_avg_revenue: 1375,
  customer_satisfaction: 4.7,
  bookings: 187,
  avg_booking_value: 227,
  retention_rate: 68,
  reviews_avg: 4.5,
  reviews_count: 124,
  revenue_trend: [3200, 3800, 3100, 4100, 3600, 3200, 4500, 3800, 4200, 3900, 4300, 4800],
  booking_trend: [12, 15, 10, 18, 14, 12, 19, 16, 17, 15, 18, 21],
  peak_hours: [
    { hour: 12, value: 18 },
    { hour: 13, value: 22 },
    { hour: 14, value: 16 },
    { hour: 15, value: 14 },
    { hour: 16, value: 19 },
    { hour: 17, value: 24 },
    { hour: 18, value: 28 },
    { hour: 19, value: 26 },
    { hour: 20, value: 21 },
    { hour: 21, value: 15 },
  ]
};
