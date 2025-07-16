
import React, { useState } from 'react';
import { UpcomingBooking } from '@/types/bookingTypes';
import { BookingsTable } from './table/BookingsTable';
import { GuestProfileDialog } from './GuestProfileDialog';
import { EmptyState } from './table/EmptyState';
import { Card } from '@/components/ui/card';

interface UpcomingBookingsTableProps {
  bookings: UpcomingBooking[];
  onSendReminder: (bookingId: string) => Promise<boolean>;
  onConfirmBooking: (bookingId: string) => Promise<boolean>;
  onCancelBooking: (bookingId: string, reason?: string) => Promise<boolean>;
  onRescheduleBooking: (bookingId: string, newDate: Date, newSessionId: string) => Promise<boolean>;
  onUpdatePaymentStatus?: (bookingId: string, newStatus: any) => Promise<boolean>;
}

export function UpcomingBookingsTable({
  bookings,
  onSendReminder,
  onConfirmBooking,
  onCancelBooking,
  onRescheduleBooking,
  onUpdatePaymentStatus
}: UpcomingBookingsTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>('bookingDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showGuestProfileDialog, setShowGuestProfileDialog] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };
  
  // Sort bookings
  const sortedBookings = [...bookings].sort((a, b) => {
    if (!sortColumn) return 0;
    
    let valueA: any = a[sortColumn as keyof UpcomingBooking];
    let valueB: any = b[sortColumn as keyof UpcomingBooking];
    
    // Special handling for nested properties
    if (sortColumn === 'guestName') {
      valueA = a.guestName.toLowerCase();
      valueB = b.guestName.toLowerCase();
    } else if (sortColumn === 'sessionName') {
      valueA = a.sessionName.toLowerCase();
      valueB = b.sessionName.toLowerCase();
    }
    
    // Handle date sorting
    if (sortColumn === 'bookingDate' || sortColumn === 'createdAt' || sortColumn === 'lastReminderSent') {
      valueA = new Date(valueA || 0).getTime();
      valueB = new Date(valueB || 0).getTime();
    }
    
    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  
  const handleOpenGuestProfile = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setShowGuestProfileDialog(true);
  };
  
  const selectedBooking = selectedBookingId ? bookings.find(b => b.id === selectedBookingId) : null;
  
  if (bookings.length === 0) {
    return (
      <Card className="overflow-hidden border shadow-sm">
        <div className="py-12 px-6 flex flex-col items-center justify-center text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-muted-foreground"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
              <path d="M8 14h.01" />
              <path d="M12 14h.01" />
              <path d="M16 14h.01" />
              <path d="M8 18h.01" />
              <path d="M12 18h.01" />
              <path d="M16 18h.01" />
            </svg>
          </div>
          <h3 className="text-lg font-medium">No bookings found</h3>
          <p className="text-muted-foreground mt-1">There are no bookings matching your filters.</p>
        </div>
      </Card>
    );
  }
  
  return (
    <>
      <Card className="overflow-hidden border shadow-sm">
        <BookingsTable
          bookings={sortedBookings}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          handleSort={handleSort}
          onSendReminder={onSendReminder}
          onConfirmBooking={onConfirmBooking}
          onCancelBooking={onCancelBooking}
          onRescheduleBooking={onRescheduleBooking}
          onOpenGuestProfile={handleOpenGuestProfile}
          onUpdatePaymentStatus={onUpdatePaymentStatus}
        />
      </Card>
      
      {selectedBooking && (
        <GuestProfileDialog
          open={showGuestProfileDialog}
          onOpenChange={setShowGuestProfileDialog}
          booking={selectedBooking}
        />
      )}
    </>
  );
}
