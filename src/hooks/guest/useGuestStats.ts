
import { useState, useEffect } from 'react';
import { Guest, GuestStats } from '@/types/guestTypes';

export const useGuestStats = (guests: Guest[]): GuestStats => {
  const [stats, setStats] = useState<GuestStats>({
    totalGuests: 0,
    newThisMonth: 0,
    vipGuests: 0,
    vipPercentage: 0,
    averageVisits: 0,
    recordedPreferences: 0,
    offerEngagement: 0,
    mostPopularOffer: ""
  });
  
  useEffect(() => {
    setStats(calculateGuestStats(guests));
  }, [guests]);
  
  return stats;
};

export const calculateGuestStats = (guests: Guest[]): GuestStats => {
  const totalGuests = guests.length;
  
  // New this month
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const newThisMonth = guests.filter(g => new Date(g.createdAt) > oneMonthAgo).length;
  
  // VIP stats
  const vipGuests = guests.filter(g => g.guestType === "VIP").length;
  const vipPercentage = totalGuests > 0 ? Math.round((vipGuests / totalGuests) * 100) : 0;
  
  // Average visits
  const totalVisits = guests.reduce((sum, g) => sum + g.totalVisits, 0);
  const averageVisits = totalGuests > 0 ? parseFloat((totalVisits / totalGuests).toFixed(1)) : 0;
  
  // Recorded preferences
  const recordedPreferences = guests.reduce((sum, g) => sum + (g.preferences?.length || 0), 0);
  
  // Offer engagement (mock calculation)
  const guestsWithOffers = guests.filter(g => g.loyalty && g.loyalty.availablePoints !== g.loyalty.totalPoints).length;
  const offerEngagement = totalGuests > 0 ? Math.round((guestsWithOffers / totalGuests) * 100) : 0;
  
  return {
    totalGuests,
    newThisMonth,
    vipGuests,
    vipPercentage,
    averageVisits,
    recordedPreferences,
    offerEngagement,
    mostPopularOffer: "Birthday Special Discount"
  };
};
