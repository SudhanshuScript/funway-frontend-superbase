
import { Guest, GuestType } from '@/types/guestTypes';

// Mock data function
export const generateMockGuests = (): Guest[] => {
  const preferences = [
    "Window Seat", 
    "Vegetarian", 
    "Birthday Package", 
    "Evening Sessions", 
    "Special Assistance",
    "Celebration Package",
    "Kids Menu",
    "Allergen Information",
    "Photography Package"
  ];

  return Array.from({ length: 30 }, (_, i) => {
    const id = `G-${String(i + 1).padStart(3, '0')}`;
    const visitCount = Math.floor(Math.random() * 15);
    let guestType: GuestType = "New";
    
    if (visitCount === 0) {
      guestType = "New";
    } else if (visitCount > 5) {
      guestType = "VIP";
    } else if (visitCount >= 2) {
      guestType = "Regular";
    }
    
    // Randomly assign some as inactive or high potential
    if (i % 11 === 0) guestType = "Inactive";
    if (i % 13 === 0) guestType = "High Potential";
    
    const loyaltyPoints = visitCount * 30;
    const redeemedPoints = Math.floor(loyaltyPoints * 0.4);
    
    // Generate random dates
    const now = new Date();
    const createdDate = new Date(now);
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 365));
    
    const lastVisitDate = new Date(now);
    if (guestType === "Inactive") {
      lastVisitDate.setDate(lastVisitDate.getDate() - 100 - Math.floor(Math.random() * 100));
    } else {
      lastVisitDate.setDate(lastVisitDate.getDate() - Math.floor(Math.random() * 60));
    }
    
    const guestPreferences = [];
    const prefCount = Math.floor(Math.random() * 3);
    for (let j = 0; j < prefCount; j++) {
      const randomPref = preferences[Math.floor(Math.random() * preferences.length)];
      if (!guestPreferences.find(p => p.preference === randomPref)) {
        guestPreferences.push({
          id: `pref-${i}-${j}`,
          preference: randomPref
        });
      }
    }
    
    return {
      id: `guest-${i}`,
      guestId: id,
      name: [`John Smith`, `Emily Johnson`, `Robert Chen`, `Sarah Williams`, 
             `Michael Davis`, `Jessica Brown`, `David Wilson`, `Amanda Taylor`, 
             `James Anderson`, `Lisa Thomas`][i % 10],
      email: `guest${i + 1}@example.com`,
      phone: `+1 (555) ${String(Math.floor(100 + Math.random() * 900))}-${String(Math.floor(1000 + Math.random() * 9000)).substring(0, 4)}`,
      guestType,
      franchiseId: i % 3 === 0 ? "franchise-1" : i % 3 === 1 ? "franchise-2" : "franchise-3",
      franchiseName: i % 3 === 0 ? "Downtown FlyDining" : i % 3 === 1 ? "Riverside Experience" : "Mountain View",
      lastVisit: lastVisitDate.toISOString().split('T')[0],
      totalVisits: visitCount,
      createdAt: createdDate.toISOString(),
      updatedAt: lastVisitDate.toISOString(),
      preferences: guestPreferences,
      loyalty: {
        totalPoints: loyaltyPoints,
        availablePoints: loyaltyPoints - redeemedPoints,
        transactions: [{
          id: `loyalty-${i}-1`,
          pointsEarned: loyaltyPoints,
          pointsRedeemed: redeemedPoints,
          source: "Booking",
          eventTime: lastVisitDate.toISOString()
        }]
      },
      upcomingBookings: i % 5 === 0 ? 1 : 0,
      notes: i % 4 === 0 ? "VIP guest, always prefers window seating and complimentary dessert." : undefined,
      tags: i % 7 === 0 ? ["Family", "Birthday", "Anniversary"] : i % 5 === 0 ? ["Business", "Vegetarian"] : undefined
    };
  });
};
