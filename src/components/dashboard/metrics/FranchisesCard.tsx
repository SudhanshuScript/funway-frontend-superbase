
import React from "react";
import { Building } from "lucide-react";
import { MetricCard } from "./MetricCard";
import { DashboardData } from "@/types/dashboardTypes";

interface FranchisesCardProps {
  data: DashboardData;
  onViewFranchises?: () => void;
}

export const FranchisesCard: React.FC<FranchisesCardProps> = ({ 
  data, 
  onViewFranchises 
}) => {
  if (!data.franchises) return null;
  
  return (
    <MetricCard
      title="Active Franchises"
      value={`${data.franchises.active}/${data.franchises.total}`}
      icon={<Building className="h-4 w-4" />}
      subValue={`${((data.franchises.active / data.franchises.total) * 100).toFixed(0)}% operational`}
      onClick={onViewFranchises}
    />
  );
};
