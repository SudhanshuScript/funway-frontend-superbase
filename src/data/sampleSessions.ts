
import { Session } from "@/types/sessionTypes";
import { format, addDays, subDays } from "date-fns";

// Generate today and nearby dates for testing
const today = new Date();
const tomorrow = addDays(today, 1);
const dayAfterTomorrow = addDays(today, 2);
const nextWeek = addDays(today, 7);
const yesterday = subDays(today, 1);
const lastWeek = subDays(today, 7);

// Sample sessions for testing/development purposes
export const sampleSessions: Session[] = [
  // Today's Sessions
  {
    id: "1",
    name: "Morning Bliss",
    type: "breakfast",
    date: format(today, "yyyy-MM-dd"),
    startTime: "08:00",
    endTime: "10:00",
    duration: 120,
    maxCapacity: 30,
    bookedCount: 12,
    isActive: true
  },
  {
    id: "2",
    name: "Sky-High Lunch",
    type: "lunch",
    date: format(today, "yyyy-MM-dd"),
    startTime: "12:30",
    endTime: "14:30",
    duration: 120,
    maxCapacity: 25,
    bookedCount: 18,
    isActive: true
  },
  {
    id: "3",
    name: "Sunset Dinner",
    type: "dinner",
    date: format(today, "yyyy-MM-dd"),
    startTime: "19:00",
    endTime: "21:00",
    duration: 120,
    maxCapacity: 20,
    bookedCount: 20,
    isActive: true
  },
  {
    id: "4",
    name: "Twilight Special",
    type: "evening snacks",
    date: format(today, "yyyy-MM-dd"),
    startTime: "16:30",
    endTime: "18:00",
    duration: 90,
    maxCapacity: 15,
    bookedCount: 8,
    isActive: true
  },
  
  // Tomorrow's Sessions
  {
    id: "5",
    name: "Cloud Breakfast",
    type: "breakfast",
    date: format(tomorrow, "yyyy-MM-dd"),
    startTime: "07:30",
    endTime: "09:30",
    duration: 120,
    maxCapacity: 25,
    bookedCount: 5,
    isActive: true
  },
  {
    id: "6",
    name: "Sky Brunch",
    type: "breakfast",
    date: format(tomorrow, "yyyy-MM-dd"),
    startTime: "10:00",
    endTime: "12:00",
    duration: 120,
    maxCapacity: 25,
    bookedCount: 15,
    isActive: true
  },
  {
    id: "7",
    name: "Starlight Dinner",
    type: "dinner",
    date: format(tomorrow, "yyyy-MM-dd"),
    startTime: "18:00",
    endTime: "20:00",
    duration: 120,
    maxCapacity: 30,
    bookedCount: 10,
    isActive: true
  },
  
  // Special events
  {
    id: "8",
    name: "Valentine's Day Special",
    type: "special event",
    date: format(dayAfterTomorrow, "yyyy-MM-dd"),
    startTime: "19:00",
    endTime: "22:00",
    duration: 180,
    maxCapacity: 15,
    bookedCount: 12,
    isActive: true,
    isSpecialDate: true,
    specialDateName: "Valentine's Day Special",
    specialPricing: 149.99,
    specialAddOns: ["champagne", "roses", "private_dining"],
    specialConditions: "Romantic dinner with premium view"
  },
  
  // Next week special
  {
    id: "9",
    name: "Full Moon Dinner",
    type: "special event",
    date: format(nextWeek, "yyyy-MM-dd"),
    startTime: "19:30",
    endTime: "22:30",
    duration: 180,
    maxCapacity: 20,
    bookedCount: 5,
    isActive: true,
    isSpecialDate: true,
    specialDateName: "Full Moon Celebration",
    specialPricing: 129.99,
    specialAddOns: ["special_menu", "live_music"],
    specialConditions: "Dinner under the full moon with special entertainment"
  },
  
  // Past sessions (inactive)
  {
    id: "10",
    name: "Yesterday's Breakfast",
    type: "breakfast",
    date: format(yesterday, "yyyy-MM-dd"),
    startTime: "08:00",
    endTime: "10:00",
    duration: 120,
    maxCapacity: 30,
    bookedCount: 22,
    isActive: false
  },
  {
    id: "11",
    name: "Last Week's Dinner",
    type: "dinner",
    date: format(lastWeek, "yyyy-MM-dd"),
    startTime: "19:00",
    endTime: "21:00",
    duration: 120,
    maxCapacity: 25,
    bookedCount: 18,
    isActive: false
  },
  {
    id: "12",
    name: "Cocktail Evening",
    type: "evening snacks",
    date: format(yesterday, "yyyy-MM-dd"),
    startTime: "17:00",
    endTime: "19:00",
    duration: 120,
    maxCapacity: 20,
    bookedCount: 12,
    isActive: false
  },
  {
    id: "13",
    name: "Business Lunch",
    type: "lunch",
    date: format(lastWeek, "yyyy-MM-dd"),
    startTime: "12:00",
    endTime: "14:00",
    duration: 120,
    maxCapacity: 15,
    bookedCount: 10,
    isActive: false
  }
];
