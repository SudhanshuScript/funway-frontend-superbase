
import { LucideIcon, Coffee, Utensils, Sunrise, Sunset, MoonStar } from "lucide-react";

export interface SessionType {
  name: string;
  timeSlots: string[];
  icon: LucideIcon;
  duration: string;
  price: string;
}

export interface FeaturedSession {
  date: Date;
  session: string;
  time: string;
  remainingSeats: number;
}

export const sessionData: Record<string, SessionType> = {
  breakfast: {
    name: "Breakfast",
    timeSlots: ["07:00", "08:00", "09:00"],
    icon: Coffee,
    duration: "90 min",
    price: "$89 per person"
  },
  brunch: {
    name: "Brunch",
    timeSlots: ["10:00", "11:00"],
    icon: Coffee,
    duration: "100 min",
    price: "$99 per person"
  },
  lunch: {
    name: "Lunch",
    timeSlots: ["12:00", "13:00", "14:00"],
    icon: Utensils,
    duration: "90 min",
    price: "$109 per person"
  },
  joyride: {
    name: "Joyride",
    timeSlots: ["15:00"],
    icon: Sunrise,
    duration: "60 min",
    price: "$79 per person"
  },
  dinner: {
    name: "Dinner",
    timeSlots: ["18:00", "19:00", "20:00"],
    icon: Utensils,
    duration: "120 min",
    price: "$149 per person"
  },
  aurora: {
    name: "Aurora Flight",
    timeSlots: ["19:30"],
    icon: MoonStar,
    duration: "120 min",
    price: "$179 per person"
  },
  twilight: {
    name: "Twilight",
    timeSlots: ["17:30"],
    icon: Sunset,
    duration: "90 min",
    price: "$139 per person"
  }
};

export const addonPackages = [
  { id: "none", name: "No Add-ons", description: "Standard experience", price: "$0" },
  { id: "celebration", name: "Celebration Package", description: "Cake, decorations & champagne", price: "$49" },
  { id: "premium", name: "Premium Drinks", description: "Selection of premium wines & cocktails", price: "$39" },
  { id: "photography", name: "Photography", description: "Professional photos of your experience", price: "$59" },
  { id: "all_inclusive", name: "All Inclusive", description: "Celebration, premium drinks & photos", price: "$129" }
];

export const featuredSessions = [
  { date: new Date(new Date().setDate(new Date().getDate() + 1)), session: "dinner", time: "19:00", remainingSeats: 8 },
  { date: new Date(new Date().setDate(new Date().getDate() + 2)), session: "twilight", time: "17:30", remainingSeats: 6 },
  { date: new Date(new Date().setDate(new Date().getDate() + 3)), session: "aurora", time: "19:30", remainingSeats: 4 },
  { date: new Date(new Date().setDate(new Date().getDate() + 1)), session: "lunch", time: "13:00", remainingSeats: 12 }
];
