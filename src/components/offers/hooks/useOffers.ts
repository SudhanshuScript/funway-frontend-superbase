
import { useState, useEffect } from 'react';
import { Offer } from '@/types/offerTypes';
import { mockOffers } from './mockOfferData';
import { useOfferFilters } from './useOfferFilters';
import { useOfferAnalytics } from './useOfferAnalytics';

export const useOffers = () => {
  const [offers, setOffers] = useState<Offer[]>(mockOffers);
  const [isLoading, setIsLoading] = useState(false);
  const { filters, setFilters } = useOfferFilters();
  
  // Get offerIds for analytics
  const offerIds = offers.map(offer => offer.id);
  const { analytics, isLoading: analyticsLoading } = useOfferAnalytics(offerIds);

  // Combined loading state
  const isLoadingData = isLoading || analyticsLoading;

  return {
    offers,
    analytics,
    isLoading: isLoadingData,
    filters,
    setFilters
  };
};
