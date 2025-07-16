
import React from 'react';
import { Button } from "@/components/ui/button";
import { FilterIcon, X, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FilterOption } from './utils/filterTypes';
import { format } from "date-fns";

interface FilterHeaderProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  activeFilters: FilterOption[];
  removeFilter: (column: string) => void;
  clearAllFilters: () => void;
}

export function FilterHeader({ 
  showFilters, 
  setShowFilters, 
  activeFilters, 
  removeFilter,
  clearAllFilters 
}: FilterHeaderProps) {
  const getFilterDisplayValue = (filter: FilterOption) => {
    switch (filter.type) {
      case 'text':
      case 'select':
        return String(filter.value);
      case 'dateRange':
        const dateRange = filter.value as [Date | undefined, Date | undefined];
        return `${dateRange[0] ? format(dateRange[0], 'PP') : ''} - ${dateRange[1] ? format(dateRange[1], 'PP') : ''}`;
      case 'numberRange':
        const numRange = filter.value as [number, number];
        return `${numRange[0]} - ${numRange[1]}`;
      default:
        return String(filter.value);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 items-center justify-between">
      <div className="flex flex-wrap gap-2 items-center">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center"
        >
          <FilterIcon className="h-4 w-4 mr-2" />
          Filters
          <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </Button>
        
        <div className="flex flex-wrap gap-1">
          {activeFilters.map((filter, idx) => (
            <Badge key={idx} variant="outline" className="flex items-center gap-1 py-1">
              <span className="font-semibold mr-1">{filter.label}:</span> 
              <span>{getFilterDisplayValue(filter)}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 p-0 ml-1" 
                onClick={() => removeFilter(filter.column)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      </div>
      
      {activeFilters.length > 0 && (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={clearAllFilters}
        >
          Clear all
        </Button>
      )}
    </div>
  );
}
