
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ComparisonMetricCardProps {
  title: string;
  currentValue: string;
  previousValue: string;
  percentageChange: number;
  isPositive: boolean;
  icon: React.ReactNode;
}

const ComparisonMetricCard = ({
  title,
  currentValue,
  previousValue,
  percentageChange,
  isPositive,
  icon
}: ComparisonMetricCardProps) => {
  return (
    <TooltipProvider>
      <Card className="hover:shadow-md transition-all duration-200">
        <CardContent className="p-5">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-full ${isPositive ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                {icon}
              </div>
              <h3 className="font-medium">{title}</h3>
            </div>
            <Tooltip>
              <TooltipTrigger className="cursor-help">
                <div className="flex items-center gap-1 text-sm">
                  {isPositive ? (
                    <TrendingUp className={`h-4 w-4 text-green-500`} />
                  ) : (
                    <TrendingDown className={`h-4 w-4 text-red-500`} />
                  )}
                  <span className={`${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {percentageChange.toFixed(1)}%
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Previous period: {previousValue}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="text-3xl font-bold">{currentValue}</div>
          <div className="mt-2 text-xs text-muted-foreground">
            vs {previousValue} previous period
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default ComparisonMetricCard;
