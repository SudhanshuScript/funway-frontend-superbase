
import React from "react";
import { Clock } from "lucide-react";

interface OperationsHeaderProps {
  date?: Date;
}

export function OperationsHeader({ date = new Date() }: OperationsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Clock className="h-6 w-6 mr-2" />
        <h2 className="text-2xl font-bold">Operations Dashboard</h2>
      </div>
      <div className="text-sm text-muted-foreground">
        {date.toLocaleString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </div>
    </div>
  );
}
