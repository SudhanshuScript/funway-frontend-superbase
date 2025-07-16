
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface BookingQueriesProps {
  bookingType?: string;
}

export function BookingQueries({ bookingType }: BookingQueriesProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            {bookingType ? `${bookingType} bookings` : 'Booking queries'} feature is in development.
          </p>
          <Button variant="outline">
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
