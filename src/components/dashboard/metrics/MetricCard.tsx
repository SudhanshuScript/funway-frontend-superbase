
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { MetricCardProps } from "@/types/dashboardTypes";

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  subValue,
  change,
  subItems,
  onClick
}) => {
  return (
    <Card 
      className={`shadow-sm border h-full rounded-xl ${onClick ? "cursor-pointer transition-all hover:shadow-md hover:border-[#7B61FF]/30" : ""}`} 
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
      role={onClick ? "button" : undefined}
      aria-label={onClick ? `View ${title} details` : undefined}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-5 pt-4">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-[#7B61FF]" aria-hidden="true">{icon}</div>
      </CardHeader>
      <CardContent className="px-5 pb-4">
        <div className="text-2xl font-semibold">{value}</div>
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-muted-foreground">
            {subValue}
          </p>
          {change && (
            <div 
              className={`flex items-center text-xs ${change.isPositive ? 'text-[#00C48C]' : 'text-[#FF647C]'}`}
              aria-label={`${change.isPositive ? 'Increased' : 'Decreased'} by ${Math.abs(change.value).toFixed(1)}%`}
            >
              {change.isPositive ? <ArrowUpRight className="h-3 w-3 mr-1" aria-hidden="true" /> : <ArrowDownRight className="h-3 w-3 mr-1" aria-hidden="true" />}
              {Math.abs(change.value).toFixed(1)}%
            </div>
          )}
        </div>
        
        {subItems && subItems.length > 0 && (
          <div className="mt-3 space-y-2 border-t pt-2">
            {subItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">{item.label}</span>
                <div className="flex items-center">
                  {item.icon && <span className="mr-1" aria-hidden="true">{item.icon}</span>}
                  <span className={item.color ? item.color : ""}>{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
