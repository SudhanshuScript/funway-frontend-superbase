
import React from 'react';
import { UpcomingBooking } from "@/types/bookingTypes";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingsByDateView } from './BookingsByDateView';
import { BookingsBySessionView } from './BookingsBySessionView';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

interface BookingDetailsCardProps {
  bookingsByDate: Record<string, UpcomingBooking[]>;
  bookingsBySession: Record<string, UpcomingBooking[]>;
}

export function BookingDetailsCard({ bookingsByDate, bookingsBySession }: BookingDetailsCardProps) {
  return (
    <Tabs defaultValue="by-date" className="w-full">
      <TabsList>
        <TabsTrigger value="by-date">By Date</TabsTrigger>
        <TabsTrigger value="by-session">By Session</TabsTrigger>
      </TabsList>
      
      <TabsContent value="by-date">
        <Card>
          <CardHeader>
            <CardTitle>Bookings By Date</CardTitle>
          </CardHeader>
          <CardContent>
            <BookingsByDateView bookingsByDate={bookingsByDate} />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="by-session">
        <Card>
          <CardHeader>
            <CardTitle>Bookings By Session</CardTitle>
          </CardHeader>
          <CardContent>
            <BookingsBySessionView bookingsBySession={bookingsBySession} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
