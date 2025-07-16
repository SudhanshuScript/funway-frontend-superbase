
import { 
  ViewType, 
  DateFilterType, 
  FranchisePerformance, 
  RevenueTrend, 
  BookingDistribution, 
  PaymentStatus, 
  OfferUtilization 
} from "@/services/dashboard/types";

export interface ChartDataProps {
  viewType: ViewType;
  dateFilter: DateFilterType;
}

export type FranchiseData = FranchisePerformance;
export type RevenueData = RevenueTrend;
export type BookingData = BookingDistribution;
export type PaymentData = PaymentStatus;
export type OfferData = OfferUtilization;
