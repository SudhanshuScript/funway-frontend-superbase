
import React from "react";
import { X, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface LoyaltyRangeFilterProps {
  loyaltyRange: { min: number | null; max: number | null } | null;
  onLoyaltyRangeChange: (values: number[]) => void;
  onClearLoyaltyRange: () => void;
}

const LoyaltyRangeFilter: React.FC<LoyaltyRangeFilterProps> = ({
  loyaltyRange,
  onLoyaltyRangeChange,
  onClearLoyaltyRange,
}) => {
  return (
    <div className="space-y-4 pt-2">
      <div className="flex justify-between">
        <h4 className="font-medium flex items-center mb-4">
          <Award className="h-4 w-4 mr-2" /> Loyalty Points
        </h4>
        {(loyaltyRange?.min !== null || loyaltyRange?.max !== null) && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2"
            onClick={onClearLoyaltyRange}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      <Slider
        defaultValue={[0, 500]}
        max={500}
        step={10}
        onValueChange={onLoyaltyRangeChange}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0 points</span>
        <span>500+ points</span>
      </div>
    </div>
  );
};

export default LoyaltyRangeFilter;
