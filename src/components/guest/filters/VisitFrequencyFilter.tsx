
import React from "react";
import { X, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface VisitFrequencyFilterProps {
  minBookings: number | null;
  maxBookings: number | null;
  onVisitsRangeChange: (values: number[]) => void;
  onClearVisitsRange: () => void;
}

const VisitFrequencyFilter: React.FC<VisitFrequencyFilterProps> = ({
  minBookings,
  maxBookings,
  onVisitsRangeChange,
  onClearVisitsRange,
}) => {
  return (
    <div className="space-y-4 pt-2">
      <div className="flex justify-between">
        <h4 className="font-medium flex items-center mb-4">
          <Tag className="h-4 w-4 mr-2" /> Visit Frequency
        </h4>
        {(minBookings !== null || maxBookings !== null) && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2"
            onClick={onClearVisitsRange}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      <Slider
        defaultValue={[0, 15]}
        max={15}
        step={1}
        onValueChange={onVisitsRangeChange}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0 visits</span>
        <span>15+ visits</span>
      </div>
    </div>
  );
};

export default VisitFrequencyFilter;
