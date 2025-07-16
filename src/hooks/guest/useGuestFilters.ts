
import { useState, useCallback } from "react";
import { Guest, GuestFilters } from "@/types/guestTypes";

export const useGuestFilters = (allGuests: Guest[]) => {
  const initialFilters: GuestFilters = {
    search: "",
    franchiseId: "all",
    guestType: "all",
    lastVisitRange: null,
    minBookings: null,
    maxBookings: null,
    preferences: [],
    loyaltyRange: { min: null, max: null },
    offerRedeemed: null,
  };

  const [filters, setFilters] = useState<GuestFilters>(initialFilters);
  
  const updateFilters = useCallback((newFilters: Partial<GuestFilters>) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters,
    }));
  }, []);
  
  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);
  
  // Apply filters to the guests array
  const filteredGuests = allGuests.filter(guest => {
    // Search filter (searches name, email, phone, and franchise name)
    const searchText = filters.search.toLowerCase();
    const searchMatch = !searchText 
      || guest.name.toLowerCase().includes(searchText)
      || guest.email.toLowerCase().includes(searchText)
      || guest.phone.toLowerCase().includes(searchText)
      || guest.franchiseName.toLowerCase().includes(searchText);
    
    if (!searchMatch) return false;
    
    // Franchise filter
    const franchiseMatch = filters.franchiseId === "all" 
      || guest.franchiseId === filters.franchiseId;
    
    if (!franchiseMatch) return false;
    
    // Guest type filter
    const guestTypeMatch = filters.guestType === "all" 
      || guest.guestType === filters.guestType;
    
    if (!guestTypeMatch) return false;
    
    // Last visit date range filter
    if (filters.lastVisitRange && (filters.lastVisitRange.from || filters.lastVisitRange.to)) {
      const visitDate = new Date(guest.lastVisit);
      if (filters.lastVisitRange.from && visitDate < filters.lastVisitRange.from) return false;
      if (filters.lastVisitRange.to) {
        // Add one day to include the end date fully
        const endDate = new Date(filters.lastVisitRange.to);
        endDate.setDate(endDate.getDate() + 1);
        if (visitDate > endDate) return false;
      }
    }
    
    // Upcoming bookings filter
    if (filters.minBookings !== null && guest.upcomingBookings < filters.minBookings) return false;
    if (filters.maxBookings !== null && guest.upcomingBookings > filters.maxBookings) return false;
    
    // Preferences filter
    if (filters.preferences.length > 0) {
      const hasPreference = guest.preferences?.some(pref => 
        filters.preferences.includes(pref.preference)
      );
      if (!hasPreference) return false;
    }
    
    // Loyalty points filter
    if (filters.loyaltyRange && 
        (filters.loyaltyRange.min !== null || filters.loyaltyRange.max !== null)) {
      const points = guest.loyalty?.availablePoints || 0;
      if (filters.loyaltyRange.min !== null && points < filters.loyaltyRange.min) return false;
      if (filters.loyaltyRange.max !== null && points > filters.loyaltyRange.max) return false;
    }
    
    // Offer redeemed filter
    if (filters.offerRedeemed !== null) {
      const hasRedeemedOffer = guest.offers?.some(offer => offer.status === "Redeemed");
      if (filters.offerRedeemed !== hasRedeemedOffer) return false;
    }
    
    return true;
  });
  
  return {
    filteredGuests,
    filters,
    updateFilters,
    resetFilters,
  };
};
