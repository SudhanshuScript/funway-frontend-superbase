
import React from "react";
import { X, CalendarRange } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

interface DateRangeFilterProps {
  dateRange: { from: Date | null; to: Date | null };
  onDateRangeChange: (range: { from: Date | null; to: Date | null }) => void;
  onClearDateRange: () => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  dateRange,
  onDateRangeChange,
  onClearDateRange,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <h4 className="font-medium flex items-center">
          <CalendarRange className="h-4 w-4 mr-2" /> Last Visit Range
        </h4>
        {dateRange.from && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2"
            onClick={onClearDateRange}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      <Calendar
        mode="range"
        selected={dateRange}
        onSelect={onDateRangeChange}
        className="border rounded-md p-3"
      />
    </div>
  );
};

export default DateRangeFilter;
