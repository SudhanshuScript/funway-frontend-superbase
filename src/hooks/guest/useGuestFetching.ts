
import { useState, useEffect } from 'react';
import { Guest } from '@/types/guestTypes';
import { GuestService } from '@/lib/api';

export const useGuestFetching = () => {
  const [allGuests, setAllGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load initial data
  useEffect(() => {
    const fetchGuests = async () => {
      try {
        setIsLoading(true);
        // Use the new API service layer instead of direct mock calls
        const guests = await GuestService.getGuests();
        setAllGuests(guests);
        setError(null);
      } catch (err) {
        console.error('Error fetching guests:', err);
        setError('Failed to fetch guest data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGuests();
  }, []);
  
  return {
    allGuests,
    isLoading,
    error
  };
};
