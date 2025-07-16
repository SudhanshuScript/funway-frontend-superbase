
import React from "react";
import { DollarSign } from "lucide-react";
import { MetricCard } from "./MetricCard";
import { DashboardData } from "@/types/dashboardTypes";

interface RevenueCardProps {
  data: DashboardData;
  dateFilter: string;
  onClick?: () => void;
}

export const RevenueCard: React.FC<RevenueCardProps> = ({ data, dateFilter, onClick }) => {
  return (
    <MetricCard
      title="Total Revenue"
      value={`$${data.revenue.total.toLocaleString()}`}
      icon={<DollarSign className="h-4 w-4" aria-label="Revenue" />}
      subValue={`${dateFilter === 'today' ? 'Today' : dateFilter === 'week' ? 'This Week' : 'This Month'}`}
      change={{
        value: data.revenue.change,
        isPositive: data.revenue.change > 0
      }}
      subItems={data.revenue.previousPeriod ? [
        { label: "vs Previous", value: `$${data.revenue.previousPeriod.toLocaleString()}` }
      ] : undefined}
      onClick={onClick}
    />
  );
};
