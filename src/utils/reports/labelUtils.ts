
import { ReportType, ReportDateRange } from './types';

export const getReportTypeLabel = (type: ReportType): string => {
  const labels: Record<ReportType, string> = {
    sales: 'Sales Report',
    bookings: 'Booking Trends Report',
    sessions: 'Session Performance Report',
    addons: 'Add-on Revenue Report',
    guests: 'Guest Type Summary',
    targets: 'Revenue vs Target Report',
    revenue: 'Revenue Analysis Report',
    franchises: 'Franchise Performance Report'
  };
  
  return labels[type];
};

export const getDateRangeLabel = (range: ReportDateRange): string => {
  const labels: Record<ReportDateRange, string> = {
    today: 'Today',
    week: 'This Week',
    month: 'This Month',
    quarter: 'This Quarter',
    year: 'This Year',
    custom: 'Custom Range'
  };
  
  return labels[range];
};
