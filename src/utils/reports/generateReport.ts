
import { ReportFilters, ReportData } from './types';

export const generateReport = async (filters: ReportFilters): Promise<ReportData[]> => {
  // In a real implementation, this would call an API or query Supabase
  // For now, we'll return enhanced mock data
  
  // Generate more sample data points based on the date range
  const mockReportData: ReportData[] = [];
  
  // Get the number of days to generate based on the date range
  let daysToGenerate = 1;
  switch (filters.dateRange) {
    case 'today':
      daysToGenerate = 1;
      break;
    case 'week':
      daysToGenerate = 7;
      break;
    case 'month':
      daysToGenerate = 30;
      break;
    case 'quarter':
      daysToGenerate = 90;
      break;
    case 'year':
      daysToGenerate = 365;
      break;
    case 'custom':
      if (filters.startDate && filters.endDate) {
        daysToGenerate = Math.floor((filters.endDate.getTime() - filters.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      } else {
        daysToGenerate = 7; // Default to a week if no dates are provided
      }
      break;
  }
  
  // Limit the number of data points to a reasonable amount
  daysToGenerate = Math.min(daysToGenerate, 30);
  
  // Generate mock data for each day
  const baseDate = new Date();
  const franchises = ["Downtown Restaurant", "Skyline Dining", "Mountain View", "Harbour Outlook", "Sunset Experience"];
  const sessions = ["Breakfast", "Lunch", "Dinner", "Special Event", "Private Party"];
  
  for (let i = 0; i < daysToGenerate; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - i);
    
    // Generate 2-4 entries per day across different franchises and sessions
    const entriesPerDay = Math.floor(Math.random() * 3) + 2;
    
    for (let j = 0; j < entriesPerDay; j++) {
      const franchise = franchises[Math.floor(Math.random() * franchises.length)];
      const session = sessions[Math.floor(Math.random() * sessions.length)];
      const bookings = Math.floor(Math.random() * 30) + 5;
      const revenue = (Math.random() * 4000) + 1000;
      const occupancy = Math.floor(Math.random() * 40) + 60;
      
      mockReportData.push({
        id: `${i}-${j}`,
        date: date.toISOString().split('T')[0],
        franchise,
        session,
        bookings,
        revenue: Math.round(revenue),
        gst: Math.round(revenue * 0.1),
        addons: Math.round(revenue * 0.2),
        offers: Math.floor(Math.random() * 5),
        guestTypes: {
          regular: Math.floor(bookings * 0.6),
          vip: Math.floor(bookings * 0.15),
          firstTime: Math.floor(bookings * 0.25)
        },
        occupancy
      });
    }
  }

  // Add some delay to simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockReportData;
};
