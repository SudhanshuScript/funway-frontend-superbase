
import { useState } from 'react';
import { OfferFilters } from '@/types/offerTypes';

export const useOfferFilters = () => {
  const [filters, setFilters] = useState<OfferFilters>({
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

  return {
    filters,
    setFilters,
    resetFilters
  };
};
