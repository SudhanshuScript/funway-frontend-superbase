
import * as React from "react";
import { cn } from "@/lib/utils";

export interface DayProps extends React.HTMLAttributes<HTMLDivElement> {
  date: Date;
  displayMonth: Date;
  hasEvents?: boolean;
  isSelected?: boolean;
  isToday?: boolean;
}

export function Day({
  date,
  displayMonth,
  hasEvents,
  isSelected,
  isToday,
  className,
  ...props
}: DayProps) {
  const isCurrentMonth = date.getMonth() === displayMonth.getMonth();
  
  return (
    <div
      className={cn(
        "flex items-center justify-center p-0 text-center text-sm relative",
        !isCurrentMonth && "text-muted-foreground opacity-50",
        isToday && "font-bold",
        isSelected && "bg-primary text-primary-foreground rounded-md",
        hasEvents && !isSelected && "font-medium",
        className
      )}
      {...props}
    >
      <span className="absolute inset-0 flex items-center justify-center">
        {date.getDate()}
      </span>
      {hasEvents && (
        <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2">
          <div className={cn(
            "h-1 w-1 rounded-full",
            isSelected ? "bg-primary-foreground" : "bg-primary"
          )} />
        </div>
      )}
    </div>
  );
}
