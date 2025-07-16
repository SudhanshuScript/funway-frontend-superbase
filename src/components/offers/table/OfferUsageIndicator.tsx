
import React from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface OfferUsageIndicatorProps {
  redemptions: number;
  maxRedemptions: number;
  conversionRate?: number;
  sentCount?: number;
  viewedCount?: number;
  redeemedCount?: number;
}

const OfferUsageIndicator = ({
  redemptions,
  maxRedemptions,
  conversionRate,
  sentCount,
  viewedCount,
  redeemedCount
}: OfferUsageIndicatorProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">{redemptions}/{maxRedemptions}</span>
              <span className="text-xs text-muted-foreground">
                {Math.round((redemptions / maxRedemptions) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className={cn(
                  "h-1.5 rounded-full",
                  (redemptions / maxRedemptions) > 0.7 ? "bg-green-500" : 
                  (redemptions / maxRedemptions) > 0.3 ? "bg-blue-500" : 
                  "bg-amber-500"
                )}
                style={{ width: `${Math.min(100, (redemptions / maxRedemptions) * 100)}%` }}
              />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p><strong>Conversion Rate:</strong> {conversionRate?.toFixed(1)}%</p>
            <p><strong>Sent:</strong> {sentCount}</p>
            <p><strong>Viewed:</strong> {viewedCount}</p>
            <p><strong>Redeemed:</strong> {redeemedCount}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default OfferUsageIndicator;
