
import React from "react";
import { SummaryCardsContainer } from "./summary/SummaryCardsContainer";
import { useSummaryCardActions } from "./summary/SummaryCardActions";
import { DashboardSummary } from "@/services/dashboard/types";

interface EnhancedSummaryCardsProps {
  dateFilter: string;
  viewType: string;
  data: DashboardSummary;
  onViewFranchises?: () => void;
}

export const EnhancedSummaryCards: React.FC<EnhancedSummaryCardsProps> = ({
  dateFilter,
  viewType,
  data,
  onViewFranchises,
}) => {
  const {
    handleBookingsClick,
    handleRevenueClick,
    handleOccupancyClick,
    handleGuestsClick,
    handleSatisfactionClick
  } = useSummaryCardActions(onViewFranchises);

  // Update our metric cards with the appropriate click handlers
  const enrichedData = {
    ...data,
    // Clone the data to avoid mutating the original
  };

  return (
    <SummaryCardsContainer
      dateFilter={dateFilter}
      viewType={viewType}
      data={enrichedData}
      onViewFranchises={onViewFranchises}
    />
  );
};
