
import React, { useState } from 'react';
import { UpcomingBooking } from '@/types/bookingTypes';
import { isPast } from 'date-fns';
import { toast } from "sonner";
import { BookingReminderDialog } from './dialogs/BookingReminderDialog';
import { BookingConfirmationDialog } from './dialogs/BookingConfirmationDialog';
import { BookingCancellationDialog } from './dialogs/BookingCancellationDialog';
import { BookingRescheduleDialog } from './dialogs/BookingRescheduleDialog';
import { BookingDateCell } from './cells/BookingDateCell';
import { GuestInfoCell } from './cells/GuestInfoCell';
import { SessionInfoCell } from './cells/SessionInfoCell';
import { GuestCountCell } from './cells/GuestCountCell';
import { BookingStatusBadge, PaymentStatusBadge, ReminderStatusIndicator } from './badges/BookingStatusBadges';
import { BookingActionsMenu } from './BookingActionsMenu';

interface UpcomingBookingRowProps {
  booking: UpcomingBooking;
  onSendReminder: (bookingId: string) => Promise<boolean>;
  onConfirmBooking: (bookingId: string) => Promise<boolean>;
  onCancelBooking: (bookingId: string, reason?: string) => Promise<boolean>;
  onRescheduleBooking: (bookingId: string, newDate: Date, newSessionId: string) => Promise<boolean>;
  onGuestClick?: () => void;
  onUpdatePaymentStatus?: (bookingId: string, newStatus: any) => Promise<boolean>;
}

export function UpcomingBookingRow({
  booking,
  onSendReminder,
  onConfirmBooking,
  onCancelBooking,
  onRescheduleBooking,
  onGuestClick,
  onUpdatePaymentStatus
}: UpcomingBookingRowProps) {
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [newBookingDate, setNewBookingDate] = useState<Date | undefined>(undefined);
  const [newSessionId, setNewSessionId] = useState('');

  const handleCopyContactDetails = () => {
    const contactDetails = `${booking.guestName}\n${booking.contactDetails?.email || 'No email'}\n${booking.contactDetails?.phone || 'No phone'}`;
    navigator.clipboard.writeText(contactDetails);
    toast.success("Contact details copied to clipboard");
  };

  const handleSendReminder = async () => {
    try {
      const success = await onSendReminder(booking.id);
      if (success) {
        setShowReminderDialog(false);
      }
    } catch (error) {
      console.error('Error sending reminder:', error);
    }
  };

  const handleConfirmBooking = async () => {
    try {
      const success = await onConfirmBooking(booking.id);
      if (success) {
        setShowConfirmDialog(false);
      }
    } catch (error) {
      console.error('Error confirming booking:', error);
    }
  };

  const handleCancelBooking = async () => {
    try {
      const success = await onCancelBooking(booking.id, cancellationReason);
      if (success) {
        setShowCancelDialog(false);
        setCancellationReason('');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  const handleRescheduleBooking = async () => {
    if (!newBookingDate || !newSessionId) return;

    try {
      const success = await onRescheduleBooking(booking.id, newBookingDate, newSessionId);
      if (success) {
        setShowRescheduleDialog(false);
        setNewBookingDate(undefined);
        setNewSessionId('');
      }
    } catch (error) {
      console.error('Error rescheduling booking:', error);
    }
  };

  const handleUpdatePaymentStatus = async (bookingId: string, newStatus: any) => {
    if (!onUpdatePaymentStatus) return false;
    
    try {
      // If changing to paid and booking is pending, also confirm the booking
      if (newStatus === 'paid' && booking.status === 'pending') {
        await onConfirmBooking(bookingId);
      }
      
      return await onUpdatePaymentStatus(bookingId, newStatus);
    } catch (error) {
      console.error('Error updating payment status:', error);
      return false;
    }
  };

  return (
    <tr className={booking.isNewBooking ? "bg-primary/5 animate-pulse" : ""}>
      <td className="px-4 py-3 whitespace-nowrap">
        <BookingDateCell 
          bookingDate={booking.bookingDate} 
          isNewBooking={booking.isNewBooking} 
        />
      </td>
      
      <td className="px-4 py-3 whitespace-nowrap">
        <GuestInfoCell 
          guestName={booking.guestName}
          guestType={booking.guestType}
          contactDetails={booking.contactDetails}
          onGuestClick={onGuestClick}
        />
      </td>
      
      <td className="px-4 py-3 whitespace-nowrap">
        <SessionInfoCell 
          sessionName={booking.sessionName}
          sessionId={booking.sessionId}
          addonPackage={booking.addonPackage}
        />
      </td>
      
      <td className="px-4 py-3 whitespace-nowrap">
        <GuestCountCell 
          totalGuests={booking.totalGuests}
          vegCount={booking.vegCount}
          nonVegCount={booking.nonVegCount}
        />
      </td>
      
      <td className="px-4 py-3 whitespace-nowrap">
        <BookingStatusBadge status={booking.status} />
        <ReminderStatusIndicator reminderStatus={booking.reminderStatus} />
      </td>
      
      <td className="px-4 py-3 whitespace-nowrap">
        <PaymentStatusBadge 
          status={booking.paymentStatus} 
          bookingId={booking.id}
          booking={booking}
          onStatusChange={handleUpdatePaymentStatus}
          isEditable={!!onUpdatePaymentStatus}
        />
      </td>
      
      <td className="px-4 py-3 whitespace-nowrap text-right">
        <BookingActionsMenu 
          booking={booking}
          onSendReminder={() => setShowReminderDialog(true)}
          onConfirmBooking={() => setShowConfirmDialog(true)}
          onRescheduleBooking={() => setShowRescheduleDialog(true)}
          onCancelBooking={() => setShowCancelDialog(true)}
          onGuestClick={onGuestClick}
          onCopyContactDetails={handleCopyContactDetails}
        />
        
        <BookingReminderDialog
          open={showReminderDialog}
          onOpenChange={setShowReminderDialog}
          selectedBooking={booking}
          onConfirmSendReminder={handleSendReminder}
        />
        
        <BookingConfirmationDialog
          open={showConfirmDialog}
          onOpenChange={setShowConfirmDialog}
          selectedBooking={booking}
          onConfirmBookingConfirmation={handleConfirmBooking}
        />
        
        <BookingCancellationDialog
          open={showCancelDialog}
          onOpenChange={setShowCancelDialog}
          selectedBooking={booking}
          cancellationReason={cancellationReason}
          setCancellationReason={setCancellationReason}
          onConfirmCancellation={handleCancelBooking}
        />
        
        <BookingRescheduleDialog
          open={showRescheduleDialog}
          onOpenChange={setShowRescheduleDialog}
          selectedBooking={booking}
          booking={booking}
          newBookingDate={newBookingDate}
          setNewBookingDate={setNewBookingDate}
          newSessionId={newSessionId}
          setNewSessionId={setNewSessionId}
          onConfirmReschedule={handleRescheduleBooking}
        />
      </td>
    </tr>
  );
}
