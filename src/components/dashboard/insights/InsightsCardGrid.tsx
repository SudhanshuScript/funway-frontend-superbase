
import React from 'react';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Utensils 
} from 'lucide-react';
import { InsightCard } from './InsightCard';
import { DashboardData } from '@/services/dashboard/types';

interface InsightsCardGridProps {
  dashboardData: DashboardData;
}

export const InsightsCardGrid: React.FC<InsightsCardGridProps> = ({ dashboardData }) => {
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <InsightCard
        title="Total Bookings Today"
        value={formatNumber(dashboardData.summary.bookings.total)}
        change={dashboardData.summary.bookings.change}
        icon={<Calendar className="text-primary h-6 w-6" />}
        subText="vs yesterday"
      />
      
      <InsightCard
        title="Today's Revenue"
        value={`$${formatNumber(dashboardData.summary.revenue.total)}`}
        change={dashboardData.summary.revenue.change}
        icon={<DollarSign className="text-primary h-6 w-6" />}
        subText="vs previous period"
      />
      
      <InsightCard
        title="Total Guests Today"
        value={formatNumber(dashboardData.summary.guests.today)}
        change={dashboardData.summary.guests.change}
        icon={<Users className="text-primary h-6 w-6" />}
        subText={`${dashboardData.summary.guests.new || 0} new, ${dashboardData.summary.guests.returning || 0} returning`}
      />
      
      <InsightCard
        title="Top Session Today"
        value={dashboardData.topFranchises[0]?.name.split(' ')[0] || "Sky Bistro"}
        change={8.5}
        icon={<Utensils className="text-primary h-6 w-6" />}
        subText="most booked"
      />
    </div>
  );
};
