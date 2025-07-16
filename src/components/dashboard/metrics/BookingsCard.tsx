
import React from "react";
import { Users } from "lucide-react";
import { MetricCard } from "./MetricCard";
import { DashboardData } from "@/types/dashboardTypes";

interface BookingsCardProps {
  data: DashboardData;
  onClick?: () => void;
}

export const BookingsCard: React.FC<BookingsCardProps> = ({ data, onClick }) => {
  return (
    <MetricCard
      title="Total Bookings"
      value={data.bookings.total.toString()}
      icon={<Users className="h-4 w-4" aria-label="Bookings" />}
      subValue={`${data.bookings.online} Online / ${data.bookings.walkIn} Walk-in`}
      change={{
        value: data.bookings.change,
        isPositive: data.bookings.change > 0
      }}
      onClick={onClick}
    />
  );
};
