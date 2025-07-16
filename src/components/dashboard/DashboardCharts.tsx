
import React from "react";
import { useUserRole } from "@/providers/UserRoleProvider";
import { ViewType, DateFilterType } from "@/services/dashboard/types";
import RevenueTrendChart from "./charts/RevenueTrendChart";
import TopPerformingFranchisesChart from "./charts/TopPerformingFranchisesChart";
import BookingDistributionChart from "./charts/BookingDistributionChart";
import PaymentStatusChart from "./charts/PaymentStatusChart";
import { 
  FranchisePerformance as FranchiseData, 
  RevenueTrend as RevenueData, 
  BookingDistribution as BookingData, 
  PaymentStatus as PaymentData, 
  OfferUtilization as OfferData 
} from "@/services/dashboard/types";

interface DashboardChartsProps {
  viewType: ViewType;
  dateFilter: DateFilterType;
  franchiseData: FranchiseData[];
  revenueData: RevenueData[];
  bookingData: BookingData[];
  paymentData: PaymentData[];
  offerData: OfferData[];
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({
  viewType,
  dateFilter,
  franchiseData,
  revenueData,
  bookingData,
  paymentData,
  offerData
}) => {
  const { isRole } = useUserRole();
  const isSuperAdmin = isRole("superadmin");
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
      {/* Revenue Trends Chart */}
      <RevenueTrendChart 
        data={revenueData} 
        dateFilter={dateFilter} 
      />

      {/* Top Performing Franchises - Only for superadmin */}
      {(isSuperAdmin || viewType === 'franchise') && (
        <TopPerformingFranchisesChart 
          data={franchiseData} 
        />
      )}

      {/* Booking Distribution Chart */}
      <BookingDistributionChart 
        data={bookingData} 
      />

      {/* Payment Status Chart */}
      <PaymentStatusChart 
        data={paymentData} 
      />
    </div>
  );
};
