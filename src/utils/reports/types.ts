
export type ReportType = 'sales' | 'bookings' | 'sessions' | 'addons' | 'guests' | 'targets' | 'revenue' | 'franchises';

export type ReportDateRange = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';

export type ReportFormat = 'pdf' | 'excel' | 'csv';

export interface ReportFilters {
  reportType: ReportType;
  dateRange: ReportDateRange;
  franchiseId?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface ReportData {
  id: string;
  date: string;
  franchise: string;
  session: string;
  bookings: number;
  revenue: number;
  gst: number;
  addons: number;
  offers: number;
  guestTypes: {
    regular: number;
    vip: number;
    firstTime: number;
  };
  occupancy: number;
}

export interface ReportHistoryItem {
  id: string;
  name: string;
  reportType: ReportType;
  dateRange: ReportDateRange;
  franchiseId?: string;
  downloadedAt: string;
  format: ReportFormat;
  customDateRange?: {
    from: string;
    to: string;
  };
}

export type GuestType = 'regular' | 'vip' | 'firstTime';
export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';

export const getGuestTypeBadgeVariant = (type: GuestType) => {
  switch (type) {
    case 'vip': return 'vip';
    case 'regular': return 'regular';
    case 'firstTime': return 'firstTimer';
    default: return 'default';
  }
};

export const getPaymentStatusBadgeVariant = (status: PaymentStatus) => {
  switch (status) {
    case 'paid': return 'success';
    case 'pending': return 'default';
    case 'failed': return 'destructive';
    case 'refunded': return 'outline';
    default: return 'default';
  }
};
