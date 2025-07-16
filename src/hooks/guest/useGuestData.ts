
import { useGuestFetching } from './useGuestFetching';
import { useGuestFilters } from './useGuestFilters';
import { useGuestStats } from './useGuestStats';
import { GuestService } from '@/lib/api';
import { useState, useEffect } from 'react';

export const useGuestData = () => {
  // Fetch all guests
  const { allGuests, isLoading, error } = useGuestFetching();
  
  // Apply filters to guests
  const { filteredGuests, filters, updateFilters, resetFilters } = useGuestFilters(allGuests);
  
  // Calculate stats based on all guests
  const stats = useGuestStats(allGuests);
  
  // State for preferences
  const [allPreferences, setAllPreferences] = useState<string[]>([]);
  
  // Load preferences using the API service
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const preferences = await GuestService.getGuestPreferences();
        setAllPreferences(preferences);
      } catch (error) {
        console.error('Error loading preferences:', error);
        // Fallback to extracting from current guests
        const fallbackPreferences = new Set<string>();
        allGuests.forEach(guest => {
          guest.preferences?.forEach(pref => {
            fallbackPreferences.add(pref.preference);
          });
        });
        setAllPreferences(Array.from(fallbackPreferences));
      }
    };
    
    if (allGuests.length > 0) {
      loadPreferences();
    }
  }, [allGuests]);
  
  // Get all unique preferences for filtering
  const getAllPreferences = (): string[] => {
    return allPreferences;
  };
  
  return {
    allGuests,
    filteredGuests,
    stats,
    filters,
    updateFilters,
    resetFilters,
    isLoading,
    error,
    getAllPreferences
  };
};
