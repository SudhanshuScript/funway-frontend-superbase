
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, CreditCard, Bell, X, User, Star, Clock, Map } from 'lucide-react';
import { BookingSummary, GuestChatProfile } from '@/types/chatTypes';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';

interface BookingInfoSidebarProps {
  booking: BookingSummary | null;
  guestProfile: GuestChatProfile | null;
  onModifyBooking: () => void;
  onSendPaymentLink: () => void;
  onSendReminder: () => void;
  onCancelBooking: () => void;
  onViewGuestProfile: () => void;
}

export function BookingInfoSidebar({
  booking,
  guestProfile,
  onModifyBooking,
  onSendPaymentLink,
  onSendReminder,
  onCancelBooking,
  onViewGuestProfile
}: BookingInfoSidebarProps) {
  if (!booking && !guestProfile) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-3 border-b">
          <h3 className="font-medium">Guest & Booking Info</h3>
        </div>
        <div className="flex-1 flex items-center justify-center p-4 text-center">
          <p className="text-muted-foreground">No booking or guest information available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b flex justify-between items-center">
        <h3 className="font-medium">Guest & Booking Info</h3>
        <Button variant="ghost" size="sm" onClick={onViewGuestProfile} className="text-spotBooking hover:text-spotBooking hover:bg-spotBooking/10">
          <User className="h-4 w-4 mr-2" />
          View Profile
        </Button>
      </div>

      {/* Guest Information */}
      {guestProfile && (
        <div className="p-3 space-y-2">
          <h4 className="text-sm font-medium">Guest Profile</h4>
          
          <div className="grid grid-cols-1 gap-2">
            <div className="rounded-md bg-muted p-2">
              <span className="text-xs text-muted-foreground">Name</span>
              <p className="text-sm font-medium">{guestProfile.name}</p>
            </div>
            
            <div className="rounded-md bg-muted p-2">
              <span className="text-xs text-muted-foreground">Contact</span>
              <p className="text-sm">{guestProfile.phone || "Not provided"}</p>
              <p className="text-sm">{guestProfile.email || "No email"}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-md bg-muted p-2">
                <span className="text-xs text-muted-foreground">Total Visits</span>
                <p className="text-sm font-medium">{guestProfile.total_visits}</p>
              </div>
              <div className="rounded-md bg-muted p-2">
                <span className="text-xs text-muted-foreground">Loyalty Points</span>
                <p className="text-sm font-medium">{guestProfile.loyalty_points}</p>
              </div>
            </div>

            {/* Enhanced Guest Profile */}
            <div className="rounded-md bg-muted p-2">
              <div className="flex items-center gap-1 mb-1">
                <Map className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Most Frequent Franchise</span>
              </div>
              <p className="text-sm font-medium">{guestProfile.most_frequent_franchise || "First visit"}</p>
            </div>
            
            <div className="rounded-md bg-muted p-2">
              <div className="flex items-center gap-1 mb-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Preferred Meal Time</span>
              </div>
              <p className="text-sm font-medium">{guestProfile.preferred_meal_time || "No preference"}</p>
            </div>
            
            {guestProfile.last_feedback_rating !== undefined && (
              <div className="rounded-md bg-muted p-2">
                <div className="flex items-center gap-1 mb-1">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Last Feedback</span>
                </div>
                <div className="flex items-center gap-1">
                  <p className="text-sm font-medium">
                    {Array.from({length: 5}).map((_, i) => (
                      <span key={i} className={i < guestProfile.last_feedback_rating! ? "text-yellow-500" : "text-gray-300"}>
                        ★
                      </span>
                    ))}
                  </p>
                  <span className="text-xs text-muted-foreground">({guestProfile.last_feedback_rating}/5)</span>
                </div>
              </div>
            )}
            
            {guestProfile.last_booking_issue && (
              <div className="rounded-md bg-muted p-2">
                <div className="flex items-center gap-1 mb-1">
                  <X className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Last Booking Issue</span>
                </div>
                <p className="text-sm font-medium">{guestProfile.last_booking_issue}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <Separator />

      {/* Booking Information */}
      {booking && (
        <div className="p-3 space-y-3">
          <h4 className="text-sm font-medium">Booking Details</h4>
          
          <div className="grid grid-cols-1 gap-2">
            <div className="rounded-md bg-muted p-2">
              <span className="text-xs text-muted-foreground">Session</span>
              <p className="text-sm font-medium">{booking.session_name}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-md bg-muted p-2">
                <span className="text-xs text-muted-foreground">Date</span>
                <p className="text-sm font-medium">
                  {format(new Date(booking.date), 'MMM dd, yyyy')}
                </p>
              </div>
              <div className="rounded-md bg-muted p-2">
                <span className="text-xs text-muted-foreground">Time</span>
                <p className="text-sm font-medium">{booking.time}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-md bg-muted p-2">
                <span className="text-xs text-muted-foreground">Guests</span>
                <p className="text-sm font-medium">{booking.guest_count}</p>
              </div>
              <div className="rounded-md bg-muted p-2">
                <span className="text-xs text-muted-foreground">Status</span>
                <p className="text-sm font-medium">{booking.status}</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 mt-3">
            <Button onClick={onModifyBooking} variant="outline" className="w-full justify-start text-spotBooking border-spotBooking/30 hover:bg-spotBooking/10 hover:text-spotBooking">
              <Calendar className="h-4 w-4 mr-2" />
              Modify Booking
            </Button>
            <Button onClick={onSendPaymentLink} variant="outline" className="w-full justify-start text-spotBooking border-spotBooking/30 hover:bg-spotBooking/10 hover:text-spotBooking">
              <CreditCard className="h-4 w-4 mr-2" />
              Send Payment Link
            </Button>
            <Button onClick={onSendReminder} variant="outline" className="w-full justify-start text-spotBooking border-spotBooking/30 hover:bg-spotBooking/10 hover:text-spotBooking">
              <Bell className="h-4 w-4 mr-2" />
              Send Reminder
            </Button>
            <Button onClick={onCancelBooking} variant="outline" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
              <X className="h-4 w-4 mr-2" />
              Cancel Booking
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
