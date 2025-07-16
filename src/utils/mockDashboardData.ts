
export const mockDashboardData = {
  franchises: [
    {
      name: "FlyDining Goa",
      revenue: 12400,
      bookings: { online: 35, walkIn: 7 },
      occupancy: "84%",
      satisfaction: 4.8,
      alerts: [],
      status: "Normal"
    },
    {
      name: "FlyDining Jaipur",
      revenue: 8900,
      bookings: { online: 28, walkIn: 4 },
      occupancy: "77%",
      satisfaction: 4.6,
      alerts: ["Staff shortage warning"],
      status: "Normal"
    },
    {
      name: "FlyDining Puerto Rico",
      revenue: 15200,
      bookings: { online: 42, walkIn: 6 },
      occupancy: "91%",
      satisfaction: 4.9,
      alerts: ["Near capacity"],
      status: "Top Performer"
    },
    {
      name: "FlyDining Chennai",
      revenue: 7300,
      bookings: { online: 22, walkIn: 2 },
      occupancy: "69%",
      satisfaction: 4.5,
      alerts: ["Low booking rate"],
      status: "Monitor"
    }
  ],
  exportData: {
    headers: [
      "Franchise",
      "Total Revenue (₹)",
      "Bookings (Online)",
      "Bookings (Walk-In)",
      "Occupancy (%)",
      "Customer Satisfaction",
      "Guests Served",
      "Status Alert"
    ],
    rows: [
      ["FlyDining Goa", "12400", "35", "7", "84", "4.8", "58", "Normal"],
      ["FlyDining Jaipur", "8900", "28", "4", "77", "4.6", "39", "Normal"],
      ["FlyDining Puerto Rico", "15200", "42", "6", "91", "4.9", "64", "Top Performer"],
      ["FlyDining Chennai", "7300", "22", "2", "69", "4.5", "29", "Monitor"]
    ]
  }
};

export const generateDailyEmailData = (franchiseName: string) => {
  const franchise = mockDashboardData.franchises.find(f => f.name === franchiseName);
  if (!franchise) return null;

  return {
    franchise: franchise.name,
    revenue: franchise.revenue,
    bookings: franchise.bookings,
    occupancy: franchise.occupancy,
    satisfaction: franchise.satisfaction,
    alerts: franchise.alerts
  };
};

export const generateCSVData = () => {
  const { headers, rows } = mockDashboardData.exportData;
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  return csvContent;
};
