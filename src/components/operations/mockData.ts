
export const sessions = [
  { id: 1, name: "Morning Flight", startTime: "09:00 AM", endTime: "10:30 AM", capacity: 25, booked: 20, status: "Active", type: "airline" },
  { id: 2, name: "Lunch Special", startTime: "12:00 PM", endTime: "01:30 PM", capacity: 30, booked: 28, status: "Active", type: "dining" },
  { id: 3, name: "Afternoon Adventure", startTime: "03:00 PM", endTime: "04:30 PM", capacity: 25, booked: 15, status: "Active", type: "amusement" },
  { id: 4, name: "Evening Experience", startTime: "06:00 PM", endTime: "07:30 PM", capacity: 30, booked: 12, status: "Upcoming", type: "dining" },
];

export const upcomingGuests = [
  { id: 1, name: "John & Lisa Smith", time: "12:00 PM", guests: 4, request: "Anniversary celebration", status: "Confirmed" },
  { id: 2, name: "Zhang Family", time: "12:00 PM", guests: 6, request: "Two children, ages 5 and 7", status: "Confirmed" },
  { id: 3, name: "David Williams", time: "12:00 PM", guests: 2, request: "Vegetarian meal", status: "Confirmed" },
];

export const checkedInGuests = [
  { id: 1, name: "Michael Johnson", checkedIn: "8:55 AM", assigned: "Table 3", status: "Dining" },
  { id: 2, name: "Garcia Family", checkedIn: "9:02 AM", assigned: "Table 5", status: "Dining" },
  { id: 3, name: "Sarah Thompson", checkedIn: "9:05 AM", assigned: "Table 2", status: "Completed" },
];

export const staffOnDuty = [
  { id: 1, name: "Emma Davis", role: "Host", shift: "Morning" },
  { id: 2, name: "Carlos Rodriguez", role: "Chef", shift: "Morning" },
  { id: 3, name: "Aisha Khan", role: "Safety Officer", shift: "Morning" },
  { id: 4, name: "Mark Wilson", role: "Server", shift: "Morning" },
];
