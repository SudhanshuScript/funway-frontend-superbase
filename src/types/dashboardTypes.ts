
import { DashboardSummary } from "@/services/dashboard/types";

export interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  subValue?: string;
  change?: {
    value: number;
    isPositive: boolean;
  };
  subItems?: Array<{
    label: string;
    value: string | number;
    color?: string;
    icon?: React.ReactNode;
  }>;
  onClick?: () => void;
}

export type DashboardData = DashboardSummary;

export interface EnhancedSummaryCardsProps {
  dateFilter: string;
  viewType: string;
  data: DashboardData;
  onViewFranchises?: () => void;
}
