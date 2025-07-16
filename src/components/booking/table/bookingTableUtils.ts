
import { UpcomingBooking } from '@/types/bookingTypes';

export function filterBookings(
  bookings: UpcomingBooking[], 
  searchTerm: string
): UpcomingBooking[] {
  if (!searchTerm) return bookings;
  
  const searchLower = searchTerm.toLowerCase();
  
  return bookings.filter(booking => (
    booking.id.toLowerCase().includes(searchLower) ||
    booking.guestName.toLowerCase().includes(searchLower) ||
    booking.sessionName.toLowerCase().includes(searchLower) ||
    booking.status.toLowerCase().includes(searchLower) ||
    booking.paymentStatus.toLowerCase().includes(searchLower) ||
    (booking.contactDetails?.email && booking.contactDetails.email.toLowerCase().includes(searchLower)) ||
    (booking.contactDetails?.phone && booking.contactDetails.phone.toLowerCase().includes(searchLower))
  ));
}

export function sortBookings(
  bookings: UpcomingBooking[],
  sortColumn: string | null,
  sortDirection: 'asc' | 'desc'
): UpcomingBooking[] {
  if (!sortColumn) {
    // Default sort by booking date (newest first)
    return [...bookings].sort((a, b) => 
      new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
    );
  }
  
  return [...bookings].sort((a, b) => {
    let valueA: any;
    let valueB: any;
    
    switch (sortColumn) {
      case 'bookingDate':
        valueA = new Date(a.bookingDate).getTime();
        valueB = new Date(b.bookingDate).getTime();
        break;
      case 'guestName':
        valueA = a.guestName;
        valueB = b.guestName;
        break;
      case 'guestType':
        valueA = a.guestType;
        valueB = b.guestType;
        break;
      case 'sessionName':
        valueA = a.sessionName;
        valueB = b.sessionName;
        break;
      case 'status':
        valueA = a.status;
        valueB = b.status;
        break;
      case 'paymentStatus':
        valueA = a.paymentStatus;
        valueB = b.paymentStatus;
        break;
      case 'totalGuests':
        valueA = a.totalGuests;
        valueB = b.totalGuests;
        break;
      default:
        valueA = a[sortColumn as keyof UpcomingBooking];
        valueB = b[sortColumn as keyof UpcomingBooking];
    }
    
    // Sort direction
    const direction = sortDirection === 'asc' ? 1 : -1;
    
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return direction * valueA.localeCompare(valueB);
    }
    
    return direction * (valueA > valueB ? 1 : -1);
  });
}
