
import { useState } from 'react';
import { AbandonedCart } from '@/types/bookingTypes';
import { CartFilter, UseAbandonedCartFiltersResult } from './types';

export function useAbandonedCartFilters(): UseAbandonedCartFiltersResult {
  const [activeFilter, setActiveFilter] = useState<CartFilter>("active");

  const filterCarts = (carts: AbandonedCart[], searchQuery: string): AbandonedCart[] => {
    const filteredByStatus = carts.filter(cart => {
      if (activeFilter === "active") return !cart.isArchived && !cart.isRecovered;
      if (activeFilter === "archived") return cart.isArchived;
      if (activeFilter === "recovered") return cart.isRecovered;
      return true;
    });

    if (!searchQuery) return filteredByStatus;
    
    const lowerCaseQuery = searchQuery.toLowerCase();
    return filteredByStatus.filter(cart => (
      cart.id.toLowerCase().includes(lowerCaseQuery) ||
      cart.guestName.toLowerCase().includes(lowerCaseQuery) ||
      cart.sessionName.toLowerCase().includes(lowerCaseQuery) ||
      cart.contactDetails.email.toLowerCase().includes(lowerCaseQuery)
    ));
  };

  return {
    activeFilter,
    setActiveFilter,
    filterCarts,
    filteredCarts: [], // This will be populated by the main hook
  };
}
