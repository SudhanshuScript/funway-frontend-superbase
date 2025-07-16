
import { useState } from 'react';
import { Guest } from '@/types/guestTypes';

export const useGuestSelection = () => {
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [selectedGuests, setSelectedGuests] = useState<Guest[]>([]);
  
  const handleViewProfile = (guest: Guest) => {
    setSelectedGuest(guest);
    return guest;
  };

  const handleSelectGuest = (guest: Guest) => {
    if (selectedGuests.some(g => g.id === guest.id)) {
      setSelectedGuests(selectedGuests.filter(g => g.id !== guest.id));
    } else {
      setSelectedGuests([...selectedGuests, guest]);
    }
  };
  
  const clearSelection = () => {
    setSelectedGuest(null);
    setSelectedGuests([]);
  };

  return {
    selectedGuest,
    selectedGuests,
    handleViewProfile,
    handleSelectGuest,
    setSelectedGuest,
    clearSelection
  };
};
