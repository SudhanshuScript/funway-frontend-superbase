
import React, { useState } from 'react';
import { useUpcomingBookings } from '@/hooks/useUpcomingBookings';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UpcomingBookingsTable } from './UpcomingBookingsTable';
import { UpcomingBookingsCustomData } from './UpcomingBookingsCustomData';
import { toast } from 'sonner';
import { BookingManagerHeader } from './header/BookingManagerHeader';
import { BookingManagerFilters } from './filters/BookingManagerFilters';
import { BookingReminderHistory } from './BookingReminderHistory';
import { BookingManagerPagination } from './footer/BookingManagerPagination';

export function UpcomingBookingsManager() {
  const {
    bookings,
    loading,
    activeFilter,
    setActiveFilter,
    sendReminder,
    confirmBooking,
    cancelBooking,
    rescheduleBooking,
    sendBulkReminders
  } = useUpcomingBookings();
  
  const [showCustomData, setShowCustomData] = useState(true);
  const [showReminderHistory, setShowReminderHistory] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGuestType, setSelectedGuestType] = useState<string | null>(null);
  const [selectedSessionType, setSelectedSessionType] = useState<string | null>(null);
  
  const toggleCustomData = () => {
    setShowCustomData(prev => !prev);
  };
  
  const toggleReminderHistory = () => {
    setShowReminderHistory(prev => !prev);
  };

  const handleSendBulkReminders = () => {
    const pendingBookings = bookings
      .filter(b => b.paymentStatus === 'pending')
      .map(b => b.id);
    
    if (pendingBookings.length === 0) {
      toast.error("No pending bookings found to send reminders to");
      return;
    }
    
    sendBulkReminders(pendingBookings)
      .then(count => {
        toast.success(`Successfully sent ${count} reminders`);
      })
      .catch(error => {
        toast.error("Failed to send bulk reminders");
      });
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedGuestType(null);
    setSelectedSessionType(null);
  };

  const filteredBookings = bookings.filter(booking => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesQuery = 
        booking.id.toLowerCase().includes(query) ||
        booking.guestName.toLowerCase().includes(query) ||
        booking.sessionName.toLowerCase().includes(query) ||
        (booking.contactDetails?.email && booking.contactDetails.email.toLowerCase().includes(query));
      
      if (!matchesQuery) return false;
    }
    
    if (selectedGuestType && booking.guestType !== selectedGuestType) {
      return false;
    }
    
    if (selectedSessionType && booking.sessionName !== selectedSessionType) {
      return false;
    }
    
    return true;
  });

  const sessionTypes = [...new Set(bookings.map(b => b.sessionName))];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <BookingManagerHeader
            showCustomData={showCustomData}
            toggleCustomData={toggleCustomData}
            showReminderHistory={showReminderHistory}
            toggleReminderHistory={toggleReminderHistory}
            handleSendBulkReminders={handleSendBulkReminders}
          />
        </CardHeader>
        <CardContent>
          <BookingManagerFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedGuestType={selectedGuestType}
            setSelectedGuestType={setSelectedGuestType}
            selectedSessionType={selectedSessionType}
            setSelectedSessionType={setSelectedSessionType}
            handleClearFilters={handleClearFilters}
            sessionTypes={sessionTypes}
          />

          <div className="mt-4">
            <UpcomingBookingsTable
              bookings={filteredBookings}
              onSendReminder={sendReminder}
              onConfirmBooking={confirmBooking}
              onCancelBooking={cancelBooking}
              onRescheduleBooking={rescheduleBooking}
            />
          </div>

          {showCustomData && <UpcomingBookingsCustomData bookings={filteredBookings} />}
          
          {showReminderHistory && (
            <div className="mt-6">
              <BookingReminderHistory 
                bookingIds={filteredBookings.map(booking => booking.id)} 
              />
            </div>
          )}
          
          <BookingManagerPagination 
            filteredCount={filteredBookings.length} 
            totalCount={bookings.length} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
