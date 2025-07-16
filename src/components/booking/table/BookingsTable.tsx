
import React from 'react';
import { UpcomingBooking } from '@/types/bookingTypes';
import { UpcomingBookingRow } from '../UpcomingBookingRow';
import { SortableTableHeader } from './SortableTableHeader';
import { 
  Table,
  TableHeader,
  TableBody,
  TableRow
} from "@/components/ui/table";

interface BookingsTableProps {
  bookings: UpcomingBooking[];
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc';
  handleSort: (column: string) => void;
  onSendReminder: (bookingId: string) => Promise<boolean>;
  onConfirmBooking: (bookingId: string) => Promise<boolean>;
  onCancelBooking: (bookingId: string, reason?: string) => Promise<boolean>;
  onRescheduleBooking: (bookingId: string, newDate: Date, newSessionId: string) => Promise<boolean>;
  onOpenGuestProfile: (bookingId: string) => void;
  onUpdatePaymentStatus?: (bookingId: string, newStatus: any) => Promise<boolean>;
}

export function BookingsTable({
  bookings,
  sortColumn,
  sortDirection,
  handleSort,
  onSendReminder,
  onConfirmBooking,
  onCancelBooking,
  onRescheduleBooking,
  onOpenGuestProfile,
  onUpdatePaymentStatus
}: BookingsTableProps) {
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <SortableTableHeader
                column="bookingDate"
                label="Date"
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSort={handleSort}
                className="py-3"
              />
              <SortableTableHeader
                column="guestName"
                label="Guest"
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSort={handleSort}
                className="py-3"
              />
              <SortableTableHeader
                column="sessionName"
                label="Session"
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSort={handleSort}
                className="py-3"
              />
              <SortableTableHeader
                column="totalGuests"
                label="Guests"
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSort={handleSort}
                className="py-3"
              />
              <SortableTableHeader
                column="status"
                label="Status"
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSort={handleSort}
                className="py-3"
              />
              <SortableTableHeader
                column="paymentStatus"
                label="Payment"
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSort={handleSort}
                className="py-3"
              />
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground tracking-wider">
                Actions
              </th>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <UpcomingBookingRow
                key={booking.id}
                booking={booking}
                onSendReminder={onSendReminder}
                onConfirmBooking={onConfirmBooking}
                onCancelBooking={onCancelBooking}
                onRescheduleBooking={onRescheduleBooking}
                onGuestClick={() => onOpenGuestProfile(booking.id)}
                onUpdatePaymentStatus={onUpdatePaymentStatus}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
