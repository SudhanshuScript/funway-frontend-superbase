
// Airline Operation Data
export const flightData = {
  activeFlights: 24,
  delayedFlights: 3,
  cancelledFlights: 1,
  onTimePerformance: 92,
  upcomingDepartures: [
    { id: 1, flightNumber: "SK101", destination: "Paris", status: "On Time", departureTime: "10:30 AM", gate: "A12" },
    { id: 2, flightNumber: "SK205", destination: "London", status: "Delayed", departureTime: "11:45 AM", gate: "B05" },
    { id: 3, flightNumber: "SK310", destination: "Rome", status: "On Time", departureTime: "01:15 PM", gate: "C22" },
    { id: 4, flightNumber: "SK422", destination: "New York", status: "On Time", departureTime: "03:00 PM", gate: "D01" },
  ],
  monthlyFlightData: [
    { month: "Jan", flights: 620, onTimePercentage: 91 },
    { month: "Feb", flights: 580, onTimePercentage: 93 },
    { month: "Mar", flights: 650, onTimePercentage: 89 },
    { month: "Apr", flights: 700, onTimePercentage: 92 },
    { month: "May", flights: 720, onTimePercentage: 94 },
    { month: "Jun", flights: 780, onTimePercentage: 90 },
  ]
};

// Dining Operation Data
export const diningData = {
  activeReservations: 156,
  totalTables: 200,
  occupancyRate: 78,
  avgDiningTime: 84, // in minutes
  popularDishes: [
    { id: 1, name: "Skyline Steak", orders: 42, revenue: 1680 },
    { id: 2, name: "Cloud Nine Pasta", orders: 38, revenue: 1140 },
    { id: 3, name: "First Class Sushi", orders: 35, revenue: 1225 },
    { id: 4, name: "Jet Setter Burger", orders: 29, revenue: 870 },
  ],
  reservationsData: [
    { hour: "12 PM", reservations: 24 },
    { hour: "1 PM", reservations: 18 },
    { hour: "2 PM", reservations: 12 },
    { hour: "5 PM", reservations: 15 },
    { hour: "6 PM", reservations: 28 },
    { hour: "7 PM", reservations: 32 },
    { hour: "8 PM", reservations: 27 },
  ]
};

// Amusement Park Operation Data
export const amusementData = {
  activeAttractions: 14,
  maintenanceAttractions: 2,
  totalVisitors: 2450,
  avgWaitTime: 18, // in minutes
  popularAttractions: [
    { id: 1, name: "Sky Coaster", status: "Active", waitTime: 25, capacity: 95 },
    { id: 2, name: "Drop Zone", status: "Active", waitTime: 15, capacity: 85 },
    { id: 3, name: "Looping Thunder", status: "Maintenance", waitTime: 0, capacity: 0 },
    { id: 4, name: "Galactic Spin", status: "Active", waitTime: 20, capacity: 90 },
  ],
  hourlyVisitors: [
    { hour: "9 AM", visitors: 120 },
    { hour: "10 AM", visitors: 210 },
    { hour: "11 AM", visitors: 310 },
    { hour: "12 PM", visitors: 360 },
    { hour: "1 PM", visitors: 380 },
    { hour: "2 PM", visitors: 340 },
    { hour: "3 PM", visitors: 290 },
    { hour: "4 PM", visitors: 250 },
    { hour: "5 PM", visitors: 190 },
  ]
};

// Overall Dashboard Data
export const dashboardData = {
  totalRevenue: 187500,
  customerSatisfaction: 4.7,
  activeEmployees: 312,
  pendingTasks: 17,
  revenueBreakdown: [
    { category: "Airline", value: 98000 },
    { category: "Dining", value: 54500 },
    { category: "Amusement", value: 35000 },
  ],
  weeklyTrends: [
    { day: "Mon", value: 25000 },
    { day: "Tue", value: 23000 },
    { day: "Wed", value: 26500 },
    { day: "Thu", value: 28500 },
    { day: "Fri", value: 31000 },
    { day: "Sat", value: 35500 },
    { day: "Sun", value: 33000 },
  ]
};
