
// Mock dining schedule data
export const diningSchedule = [
  {
    id: 1,
    name: "Morning Breakfast",
    time: "6:00 AM - 10:00 AM",
    menu: "Breakfast Menu",
    status: "active",
    capacity: 75,
    description: "Early morning breakfast service",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  },
  {
    id: 2,
    name: "Weekend Brunch",
    time: "9:00 AM - 2:00 PM",
    menu: "Brunch Menu",
    status: "active",
    capacity: 100,
    description: "Special weekend brunch with extended options",
    days: ["Saturday", "Sunday"]
  },
  {
    id: 3,
    name: "Lunch Special",
    time: "11:30 AM - 2:30 PM",
    menu: "Lunch Menu",
    status: "active",
    capacity: 90,
    description: "Quick service lunch for business professionals",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  },
  {
    id: 4,
    name: "Afternoon Tea",
    time: "2:00 PM - 5:00 PM",
    menu: "Tea Menu",
    status: "active",
    capacity: 50,
    description: "Traditional afternoon tea service with pastries",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  },
  {
    id: 5,
    name: "Dinner Service",
    time: "5:30 PM - 10:00 PM",
    menu: "Dinner Menu",
    status: "active",
    capacity: 120,
    description: "Fine dining dinner service with full menu",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  },
  {
    id: 6,
    name: "Special Events",
    time: "Varies",
    menu: "Special Menu",
    status: "periodic",
    capacity: 150,
    description: "Custom menu for special events and holidays",
    days: []
  }
];

// Mock guest preferences data
export const guestPreferences = [
  { id: 1, name: "Vegetarian Options", percentage: 35 },
  { id: 2, name: "Gluten-Free Options", percentage: 22 },
  { id: 3, name: "Dairy-Free Options", percentage: 18 },
  { id: 4, name: "Vegan Options", percentage: 15 },
  { id: 5, name: "Low-Carb Options", percentage: 28 },
  { id: 6, name: "Kids Menu", percentage: 12 }
];

// Mock session categories
export const sessionCategories = [
  { id: 1, name: "Morning", sessions: ["Morning Breakfast"] },
  { id: 2, name: "Midday", sessions: ["Lunch Special", "Weekend Brunch"] },
  { id: 3, name: "Evening", sessions: ["Dinner Service"] },
  { id: 4, name: "Special", sessions: ["Afternoon Tea", "Special Events"] }
];
