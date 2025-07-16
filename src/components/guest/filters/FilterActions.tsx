
import React from "react";
import { Button } from "@/components/ui/button";

interface FilterActionsProps {
  onResetFilters: () => void;
  onApplyFilters?: () => void; // Optional prop for apply filters button click
}

const FilterActions: React.FC<FilterActionsProps> = ({ onResetFilters, onApplyFilters }) => {
  const handleApplyFilters = () => {
    if (onApplyFilters) {
      onApplyFilters();
    }
  };

  return (
    <div className="flex justify-between pt-2">
      <Button variant="outline" size="sm" onClick={onResetFilters}>
        Reset All Filters
      </Button>
      {onApplyFilters && (
        <Button size="sm" onClick={handleApplyFilters}>Apply Filters</Button>
      )}
    </div>
  );
};

export default FilterActions;
