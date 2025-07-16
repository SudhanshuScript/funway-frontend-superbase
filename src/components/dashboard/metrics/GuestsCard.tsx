
import React from "react";
import { UserCheck, UserPlus, Repeat } from "lucide-react";
import { MetricCard } from "./MetricCard";
import { DashboardData } from "@/types/dashboardTypes";

interface GuestsCardProps {
  data: DashboardData;
  dateFilter: string;
  onClick?: () => void;
}

export const GuestsCard: React.FC<GuestsCardProps> = ({ data, dateFilter, onClick }) => {
  const hasGuestBreakdown = data.guests?.new !== undefined && data.guests?.returning !== undefined;
  
  return (
    <MetricCard
      title="Total Guests Served"
      value={dateFilter === 'today' ? data.guests.today.toString() : data.guests.week.toString()}
      icon={<UserCheck className="h-4 w-4" aria-label="Guests" />}
      subValue={dateFilter === 'today' ? 'Today' : 'This Week'}
      change={{
        value: data.guests.change,
        isPositive: data.guests.change > 0
      }}
      subItems={hasGuestBreakdown ? [
        { 
          label: "New", 
          value: data.guests.new || 0,
          icon: <UserPlus className="h-4 w-4 text-blue-500" aria-label="New Guests" />
        },
        { 
          label: "Returning", 
          value: data.guests.returning || 0,
          icon: <Repeat className="h-4 w-4 text-green-500" aria-label="Returning Guests" />
        }
      ] : undefined}
      onClick={onClick}
    />
  );
};
