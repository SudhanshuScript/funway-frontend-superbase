
import React from 'react';
import { OfferFilters } from '@/types/offerTypes';
import FilterPopover from './filters/FilterPopover';
import FilterControls from './filters/FilterControls';
import { 
  OfferTypeFilter, 
  StatusFilter, 
  FranchiseFilter, 
  GuestSegmentFilter, 
  ValidityTypeFilter, 
  DateRangeFilter 
} from './filters/FilterGroups';

interface OfferFiltersBarProps {
  filters: OfferFilters;
  setFilters: React.Dispatch<React.SetStateAction<OfferFilters>>;
}

const OfferFiltersBar = ({ filters, setFilters }: OfferFiltersBarProps) => {
  const [open, setOpen] = React.useState(false);
  
  // Count active filters
  const activeFilterCount = Object.entries(filters).reduce((count, [key, value]) => {
    if (key === 'dateRange') {
      if (value.from || value.to) return count + 1;
      return count;
    }
    if (value && value !== 'all') return count + 1;
    return count;
  }, 0);

  const resetFilters = () => {
    setFilters({
      type: 'all',
      status: 'all',
      franchiseId: 'all',
      guestSegment: 'all',
      validityType: 'all',
      dateRange: {
        from: null,
        to: null,
      },
    });
  };

  return (
    <FilterPopover filters={filters} activeFilterCount={activeFilterCount}>
      <div className="space-y-4">
        <h3 className="font-medium">Offer Filters</h3>
        
        <OfferTypeFilter filters={filters} setFilters={setFilters} />
        <StatusFilter filters={filters} setFilters={setFilters} />
        <FranchiseFilter filters={filters} setFilters={setFilters} />
        <GuestSegmentFilter filters={filters} setFilters={setFilters} />
        <ValidityTypeFilter filters={filters} setFilters={setFilters} />
        <DateRangeFilter filters={filters} setFilters={setFilters} />
        
        <FilterControls 
          onReset={resetFilters} 
          onApply={() => setOpen(false)} 
        />
      </div>
    </FilterPopover>
  );
};

export default OfferFiltersBar;
