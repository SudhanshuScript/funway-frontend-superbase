
import React from "react";
import { Heart } from "lucide-react";
import { MetricCard } from "./MetricCard";
import { DashboardData } from "@/types/dashboardTypes";

interface SatisfactionCardProps {
  data: DashboardData;
  onClick?: () => void;
}

export const SatisfactionCard: React.FC<SatisfactionCardProps> = ({ data, onClick }) => {
  return (
    <MetricCard
      title="Customer Satisfaction"
      value={data.satisfaction.score.toFixed(1) + "/5.0"}
      icon={<Heart className="h-4 w-4" aria-label="Customer Satisfaction" />}
      subValue={`Based on ${data.satisfaction.totalReviews} reviews`}
      change={{
        value: data.satisfaction.change,
        isPositive: data.satisfaction.change > 0
      }}
      subItems={[
        { 
          label: "Positive", 
          value: `${data.satisfaction.positive} (${((data.satisfaction.positive / data.satisfaction.totalReviews) * 100).toFixed(0)}%)`, 
          color: 'text-green-500' 
        },
        { 
          label: "Neutral", 
          value: `${data.satisfaction.neutral} (${((data.satisfaction.neutral / data.satisfaction.totalReviews) * 100).toFixed(0)}%)`, 
          color: 'text-blue-500' 
        },
        { 
          label: "Negative", 
          value: `${data.satisfaction.negative} (${((data.satisfaction.negative / data.satisfaction.totalReviews) * 100).toFixed(0)}%)`, 
          color: 'text-red-500' 
        }
      ]}
      onClick={onClick}
    />
  );
};
