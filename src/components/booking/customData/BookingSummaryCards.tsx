
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Info, User } from "lucide-react";
import { UpcomingBooking } from "@/types/bookingTypes";

interface BookingSummaryCardsProps {
  bookings: UpcomingBooking[];
}

export function BookingSummaryCards({ bookings }: BookingSummaryCardsProps) {
  // Calculate stats
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const totalGuests = bookings.reduce((sum, b) => sum + b.totalGuests, 0);
  
  const vipBookings = bookings.filter(b => b.guestType === 'VIP');
  const firstTimerBookings = bookings.filter(b => b.guestType === 'First Timer');
  const regularBookings = bookings.filter(b => b.guestType === 'Regular');

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
              <p className="text-2xl font-bold">{totalBookings}</p>
            </div>
            <Calendar className="h-8 w-8 text-primary opacity-80" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <div className="flex gap-2 mt-1">
                <Badge variant="default">{confirmedBookings} Confirmed</Badge>
                <Badge variant="secondary">{pendingBookings} Pending</Badge>
              </div>
            </div>
            <Info className="h-8 w-8 text-primary opacity-80" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Guests</p>
              <p className="text-2xl font-bold">{totalGuests}</p>
            </div>
            <User className="h-8 w-8 text-primary opacity-80" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Guest Types</p>
              <div className="flex gap-2 mt-1">
                <Badge variant="outline" className="bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {vipBookings.length} VIP
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {firstTimerBookings.length} First Timer
                </Badge>
                <Badge variant="outline">
                  {regularBookings.length} Regular
                </Badge>
              </div>
            </div>
            <User className="h-8 w-8 text-primary opacity-80" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
