
import React from "react";
import { BookingsCard } from "../metrics/BookingsCard";
import { RevenueCard } from "../metrics/RevenueCard";
import { OccupancyCard } from "../metrics/OccupancyCard";
import { GuestsCard } from "../metrics/GuestsCard";
import { SatisfactionCard } from "../metrics/SatisfactionCard";
import { DashboardData } from "@/types/dashboardTypes";

interface SummaryCardsContainerProps {
  dateFilter: string;
  viewType: string;
  data: DashboardData;
  onViewFranchises?: () => void;
}

export const SummaryCardsContainer: React.FC<SummaryCardsContainerProps> = ({
  dateFilter,
  viewType,
  data,
  onViewFranchises,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
      <BookingsCard data={data} />
      <RevenueCard data={data} dateFilter={dateFilter} />
      <OccupancyCard data={data} onClick={onViewFranchises} />
      <GuestsCard data={data} dateFilter={dateFilter} />
      <SatisfactionCard data={data} />
    </div>
  );
};
