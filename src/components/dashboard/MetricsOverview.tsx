
import React from "react";
import { EnhancedSummaryCards } from "./EnhancedSummaryCards";
import { DashboardCharts } from "./DashboardCharts";
import { OperationalMetrics } from "./OperationalMetrics";
import { useUserRole } from "@/providers/UserRoleProvider";
import { getDashboardData } from "@/services/dashboard/dashboardDataService";
import { toast } from "sonner";
import { Info, AlertTriangle, Check } from "lucide-react";
import type { DateFilterType, ViewType, LocationType } from "@/services/dashboard/types";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TopPerformingFranchises } from "./TopPerformingFranchises";

interface MetricsOverviewProps {
  dateFilter: string;
  viewType: string;
  location: string;
  onViewFranchises?: () => void;
}

export default function MetricsOverview({ 
  dateFilter = "today", 
  viewType = "overview", 
  location = "global",
  onViewFranchises
}: MetricsOverviewProps) {
  const { currentUser } = useUserRole();
  
  // Get dashboard data based on current filters and user role
  const dashboardData = getDashboardData(
    currentUser?.role || "guest",
    currentUser?.franchiseId,
    dateFilter as DateFilterType,
    viewType as ViewType,
    location as LocationType
  );

  // Enhanced data with additional metrics
  const enhancedData = {
    ...dashboardData,
    summary: {
      ...dashboardData.summary,
      revenue: {
        ...dashboardData.summary.revenue,
        previousPeriod: dashboardData.summary.revenue.total - 
          (dashboardData.summary.revenue.total * dashboardData.summary.revenue.change / 100)
      },
      satisfaction: {
        ...dashboardData.summary.satisfaction,
        positive: Math.floor(dashboardData.summary.satisfaction.totalReviews * 0.75),
        neutral: Math.floor(dashboardData.summary.satisfaction.totalReviews * 0.15),
        negative: Math.floor(dashboardData.summary.satisfaction.totalReviews * 0.10)
      },
      occupancy: {
        ...dashboardData.summary.occupancy,
        franchiseBreakdown: dashboardData.topFranchises.map(franchise => ({
          name: franchise.name,
          rate: Math.floor(Math.random() * 30) + 55 // Random between 55-85%
        }))
      },
      guests: {
        ...dashboardData.summary.guests,
        new: Math.floor(dashboardData.summary.guests.today * 0.3),
        returning: Math.floor(dashboardData.summary.guests.today * 0.7)
      }
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Summary Cards - Now placed at the top */}
      <EnhancedSummaryCards
        dateFilter={dateFilter}
        viewType={viewType}
        data={enhancedData.summary}
        onViewFranchises={onViewFranchises}
      />
      
      {/* Visualization Charts and Top Franchises - Reorganized Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Side: Top Franchises */}
        <div className="lg:col-span-4 space-y-4">
          <TopPerformingFranchises />
        </div>
        
        {/* Right Side: Charts */}
        <div className="lg:col-span-8">
          <DashboardCharts
            viewType={viewType as ViewType}
            dateFilter={dateFilter as DateFilterType}
            franchiseData={enhancedData.topFranchises}
            revenueData={enhancedData.revenueTrends}
            bookingData={enhancedData.bookingDistribution}
            paymentData={enhancedData.paymentStatus}
            offerData={enhancedData.offerUtilization}
          />
        </div>
      </div>
      
      {/* Operational Metrics */}
      <OperationalMetrics
        viewType={viewType}
        bookings={dashboardData.operationalMetrics.bookings}
        occupancy={dashboardData.operationalMetrics.occupancy}
        payments={dashboardData.operationalMetrics.payments}
        feedback={dashboardData.operationalMetrics.feedback}
        coinUsage={dashboardData.operationalMetrics.coinUsage}
        realTimeMetrics={dashboardData.operationalMetrics.realTimeMetrics}
      />
    </div>
  );
}
