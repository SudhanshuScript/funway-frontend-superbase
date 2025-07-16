
export interface FilterOption {
  column: string;
  value: string | string[] | [Date | undefined, Date | undefined] | [number, number] | null;
  type: 'text' | 'date' | 'dateRange' | 'select' | 'numberRange';
  label: string;
}

export const columnOptions = [
  { value: 'bookingId', label: 'Booking ID', type: 'text' },
  { value: 'customer', label: 'Guest Name', type: 'text' },
  { value: 'date', label: 'Booking Date', type: 'dateRange' },
  { value: 'sessionName', label: 'Session', type: 'select' },
  { value: 'totalGuests', label: 'Guest Count', type: 'numberRange' },
  { value: 'status', label: 'Payment Status', type: 'select' },
  { value: 'checkInStatus', label: 'Check-In Status', type: 'select' },
  { value: 'guestType', label: 'Guest Type', type: 'select' }
];

export const getSelectOptions = (column: string) => {
  switch (column) {
    case 'sessionName':
      return [
        { value: 'Breakfast', label: 'Breakfast' },
        { value: 'Brunch', label: 'Brunch' },
        { value: 'Lunch', label: 'Lunch' },
        { value: 'Dinner', label: 'Dinner' },
        { value: 'Sunset Dinner', label: 'Sunset Dinner' },
        { value: 'Special Event', label: 'Special Event' },
      ];
    case 'status':
      return [
        { value: 'Paid', label: 'Paid' },
        { value: 'Pending', label: 'Pending' },
        { value: 'Partial', label: 'Partial' },
        { value: 'Overdue', label: 'Overdue' },
        { value: 'Refunded', label: 'Refunded' },
      ];
    case 'checkInStatus':
      return [
        { value: 'Checked-In', label: 'Checked-In' },
        { value: 'Awaited', label: 'Awaited' },
      ];
    case 'guestType':
      return [
        { value: 'Regular', label: 'Regular' },
        { value: 'VIP', label: 'VIP' },
        { value: 'First Timer', label: 'First Timer' },
      ];
    default:
      return [];
  }
};
