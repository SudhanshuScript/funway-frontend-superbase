
import { useState, useEffect } from 'react';
import { UpcomingBooking, BookingStats } from '@/types/bookingTypes';
import { mockUpcomingBookings, mockStats } from './mockData';
import { mockBookingSystem } from '@/utils/mockBookingSystem';
import { getBookings } from '@/lib/api/bookings';

export function useBookingData() {
  const [bookings, setBookings] = useState<UpcomingBooking[]>([]);
  const [stats, setStats] = useState<BookingStats>(mockStats);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load bookings on component mount
  useEffect(() => {
    const loadBookings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Use the new API function
        const apiBookings = await getBookings({ status: 'upcoming' });
        
        // Combine API bookings with mock bookings and system bookings for now
        const systemBookings = mockBookingSystem.getBookings();
        const allBookings = [...mockUpcomingBookings, ...systemBookings, ...apiBookings];
        
        setBookings(allBookings);
      } catch (err) {
        console.error('Error loading bookings:', err);
        setError('Failed to load bookings');
        
        // Fallback to existing mock data on error
        const systemBookings = mockBookingSystem.getBookings();
        const allBookings = [...mockUpcomingBookings, ...systemBookings];
        setBookings(allBookings);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBookings();
    
    // Add listener to update bookings when new ones are added via the form
    const unsubscribe = mockBookingSystem.addListener(() => {
      loadBookings();
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    bookings,
    setBookings,
    stats,
    isLoading,
    error
  };
}
