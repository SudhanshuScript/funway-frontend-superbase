
import React from "react";
import { useFormContext } from "react-hook-form";
import { format } from "date-fns";
import { BookingFormValues } from "../MultiStepBookingFormTypes";
import { CheckCircle, Calendar, Clock, Users, Mail, Phone } from "lucide-react";

export function BookingSuccess() {
  const { watch } = useFormContext<BookingFormValues>();
  const values = watch();
  
  return (
    <div className="text-center space-y-6 animate-fade-in">
      <div className="flex justify-center">
        <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Booking Confirmed!</h2>
        <p className="text-muted-foreground mt-2">
          Your booking has been successfully created
        </p>
      </div>
      
      <div className="max-w-md mx-auto bg-muted/30 rounded-lg p-4 text-left space-y-3">
        <h3 className="font-medium">Booking Details</h3>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Date:</span>
          </div>
          <div>
            {format(new Date(values.bookingDate || ''), "PPP")}
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Time:</span>
          </div>
          <div>{values.bookingTime}</div>
          
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>Guests:</span>
          </div>
          <div>{values.numberOfGuests} people</div>
          
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>Email:</span>
          </div>
          <div>{values.email}</div>
          
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>Phone:</span>
          </div>
          <div>{values.contactNumber}</div>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground">
        A confirmation email has been sent to {values.email}.<br />
        Please check your inbox for the booking details.
      </p>
    </div>
  );
}
