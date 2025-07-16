
import React from "react";
import { BarChart3 } from "lucide-react";
import { MetricCard } from "./MetricCard";
import { DashboardData } from "@/types/dashboardTypes";

interface OccupancyCardProps {
  data: DashboardData;
  onClick?: () => void;
}

export const OccupancyCard: React.FC<OccupancyCardProps> = ({ data, onClick }) => {
  return (
    <MetricCard
      title="Occupancy Rate"
      value={`${data.occupancy.rate}%`}
      icon={<BarChart3 className="h-4 w-4" aria-label="Occupancy" />}
      subValue="Average across sessions"
      change={{
        value: data.occupancy.change,
        isPositive: data.occupancy.change > 0
      }}
      subItems={data.occupancy.franchiseBreakdown?.slice(0, 2).map(franchise => ({
        label: franchise.name,
        value: `${franchise.rate}%`,
        color: franchise.rate > 80 ? 'text-green-500' : 
               franchise.rate > 60 ? 'text-yellow-500' : 
               'text-red-500'
      }))}
      onClick={onClick}
    />
  );
};
