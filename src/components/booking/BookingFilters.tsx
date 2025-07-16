
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { FilterHeader } from './FilterHeader';
import { FilterSelector } from './FilterSelector';
import { FilterOption } from './utils/filterTypes';

interface BookingFiltersProps {
  onFilterChange?: (filters: FilterOption[]) => void;
  activeFilters?: FilterOption[];
}

export function BookingFilters({ 
  onFilterChange = () => {}, 
  activeFilters = [] 
}: BookingFiltersProps) {
  const [currentFilter, setCurrentFilter] = useState<FilterOption | null>(null);
  const [tempTextValue, setTempTextValue] = useState('');
  const [tempSelectValue, setTempSelectValue] = useState('');
  const [tempDateRange, setTempDateRange] = useState<[Date | undefined, Date | undefined]>([undefined, undefined]);
  const [tempNumberRange, setTempNumberRange] = useState<[number, number]>([0, 100]);
  const [showFilters, setShowFilters] = useState(false);

  const addFilter = () => {
    if (!currentFilter) return;
    
    if (
      (currentFilter.type === 'text' && !currentFilter.value) || 
      (currentFilter.type === 'select' && !tempSelectValue) ||
      (currentFilter.type === 'dateRange' && (!tempDateRange[0] || !tempDateRange[1])) ||
      (currentFilter.type === 'numberRange' && (tempNumberRange[0] === 0 && tempNumberRange[1] === 100))
    ) {
      return;
    }

    let filterValue: any;
    switch (currentFilter.type) {
      case 'select':
        filterValue = tempSelectValue;
        break;
      case 'dateRange':
        filterValue = tempDateRange;
        break;
      case 'numberRange':
        filterValue = tempNumberRange;
        break;
      default:
        filterValue = currentFilter.value;
    }

    const newFilter = {
      ...currentFilter,
      value: filterValue
    };

    const updatedFilters = activeFilters.filter(f => f.column !== newFilter.column);
    const finalFilters = [...updatedFilters, newFilter];
    
    onFilterChange(finalFilters);
    setCurrentFilter(null);
  };

  const removeFilter = (columnToRemove: string) => {
    const updatedFilters = activeFilters.filter(f => f.column !== columnToRemove);
    onFilterChange(updatedFilters);
  };

  const clearAllFilters = () => {
    onFilterChange([]);
  };

  return (
    <div className="space-y-2">
      <FilterHeader 
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        activeFilters={activeFilters}
        removeFilter={removeFilter}
        clearAllFilters={clearAllFilters}
      />
      
      {showFilters && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <FilterSelector
              currentFilter={currentFilter}
              setCurrentFilter={setCurrentFilter}
              tempTextValue={tempTextValue}
              setTempTextValue={setTempTextValue}
              tempSelectValue={tempSelectValue}
              setTempSelectValue={setTempSelectValue}
              tempDateRange={tempDateRange}
              setTempDateRange={setTempDateRange}
              tempNumberRange={tempNumberRange}
              setTempNumberRange={setTempNumberRange}
              addFilter={addFilter}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
