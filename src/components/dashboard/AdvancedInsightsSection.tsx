
import React from 'react';
import { useUserRole } from '@/providers/UserRoleProvider';
import { getDashboardData } from '@/services';
import { DateFilterType, ViewType, LocationType } from '@/services/dashboard/types';
import { InsightsCardGrid } from './insights/InsightsCardGrid';
import { SessionOccupancyRates } from './insights/SessionOccupancyRates';
import { FranchiseComparisonTable } from './insights/FranchiseComparisonTable';

interface AdvancedInsightsSectionProps {
  dateFilter: string;
  viewType: string;
  locationType: string;
  sortBy: string;
  sessionType: string;
  country?: string;
  city?: string;
  onViewDetailedReport: () => void;
}

export const AdvancedInsightsSection: React.FC<AdvancedInsightsSectionProps> = ({
  dateFilter,
  viewType,
  locationType,
  sortBy,
  sessionType,
  country,
  city,
  onViewDetailedReport
}) => {
  const { currentUser, isRole } = useUserRole();
  const isSuperAdmin = isRole('superadmin');
  
  // Get dashboard data based on filters
  const dashboardData = getDashboardData(
    currentUser?.role || "guest",
    currentUser?.franchiseId,
    dateFilter as DateFilterType,
    viewType as ViewType,
    locationType as LocationType
  );

  // Session occupancy data
  const sessionOccupancyData = [
    { name: "Lunch", rate: 78, capacity: 100 },
    { name: "Dinner", rate: 85, capacity: 100 },
    { name: "Special", rate: 92, capacity: 100 },
    { name: "Corporate", rate: 65, capacity: 100 },
  ];

  // For superadmin, show comparative data
  const franchiseComparisonData = isSuperAdmin ? [
    { name: "Downtown", revenue: 12500, feedback: 4.8, occupancy: 85, growth: 12.3 },
    { name: "Uptown", revenue: 9800, feedback: 4.5, occupancy: 72, growth: 8.7 },
    { name: "Riverside", revenue: 11200, feedback: 4.7, occupancy: 80, growth: 10.1 },
    { name: "Airport", revenue: 7500, feedback: 4.3, occupancy: 65, growth: -2.5 },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Insights Cards */}
      <InsightsCardGrid dashboardData={dashboardData} />

      {/* Occupancy Rate by Session Type */}
      <SessionOccupancyRates 
        data={sessionOccupancyData} 
        averageRate={dashboardData.summary.occupancy.rate} 
      />

      {/* Franchise Comparison - Superadmin Specific View */}
      {isSuperAdmin && (
        <FranchiseComparisonTable 
          data={franchiseComparisonData}
          onViewDetailedReport={onViewDetailedReport}
        />
      )}
    </div>
  );
};
