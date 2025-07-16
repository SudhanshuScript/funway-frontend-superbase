
import React from "react";
import { Button } from "@/components/ui/button";
import { MultiStepBookingForm } from "@/components/booking/MultiStepBookingForm";
import { BookingFormValues } from "@/components/booking/MultiStepBookingFormTypes";
import { toast } from "sonner";
import { useAuditLogger } from "@/utils/auditLogger";
import { GuestType, BookingStatus, PaymentStatus, ReminderStatus } from "@/types/bookingTypes";
import { format } from "date-fns";

interface MultiStepBookingFormWrapperProps {
  onCancel: () => void;
}

export function MultiStepBookingFormWrapper({ onCancel }: MultiStepBookingFormWrapperProps) {
  const { logEvent } = useAuditLogger();

  const handleMultiStepFormSubmit = (values: BookingFormValues) => {
    console.log("Multi-step form values:", values);
    
    // Map the form values to our UpcomingBooking type
    const guestType: GuestType = 
      values.customerType === "First-Time" ? "First Timer" : 
      values.customerType === "VIP" ? "VIP" : "Regular";
      
    // Use the sessionName from form if available, otherwise determine from session type
    let sessionName = values.sessionName || "Dinner"; // Default
    if (!values.sessionName) {
      if (values.sessionType === "breakfast") sessionName = "Breakfast";
      else if (values.sessionType === "brunch") sessionName = "Brunch";
      else if (values.sessionType === "lunch") sessionName = "Lunch";
      else if (values.sessionType === "dinner") sessionName = "Dinner";
      else if (values.sessionType === "aurora") sessionName = "Aurora Flight";
      else if (values.sessionType === "twilight") sessionName = "Twilight Flight";
    }
    
    // Create a booking object from form values
    const newBooking = {
      id: `BK-${Math.floor(Math.random() * 1000)}`, // Generate random ID
      guestName: values.guestName,
      guestType: guestType,
      sessionName: sessionName,
      sessionId: `${values.sessionType.substring(0, 2).toUpperCase()}-${Math.floor(Math.random() * 1000)}`,
      bookingDate: values.bookingDate || format(values.experienceDate, "yyyy-MM-dd"),
      createdAt: new Date().toISOString(),
      status: values.bookingStatus === "Confirmed" ? "confirmed" as BookingStatus : 
              values.bookingStatus === "Pending" ? "pending" as BookingStatus : "cancelled" as BookingStatus,
      paymentStatus: values.paymentStatus === "Paid" ? "paid" as PaymentStatus : 
                    values.paymentStatus === "Unpaid" ? "pending" as PaymentStatus : 
                    values.paymentStatus === "Partially Paid" ? "partial" as PaymentStatus : "refunded" as PaymentStatus,
      totalGuests: values.numberOfGuests,
      vegCount: values.vegCount,
      nonVegCount: values.nonVegCount,
      includesChildren: false,
      reminderStatus: "not_sent" as ReminderStatus,
      reminderCount: 0,
      specialRequests: values.specialRequests,
      addonPackage: values.addonPackage,
      isNewBooking: true, // Mark as new booking
      contactDetails: {
        email: values.email,
        phone: values.contactNumber
      }
    };
    
    // Add booking to our mock system
    if (window.mockBookingSystem) {
      window.mockBookingSystem.addBooking(newBooking);
    }
    
    // Show success message
    toast.success("Booking created successfully!");
    
    // Return promise to simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1500);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create New Booking</h1>
          <p className="text-muted-foreground mt-1">
            Fill in the details to create a new booking
          </p>
        </div>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
      
      <MultiStepBookingForm 
        onSubmit={handleMultiStepFormSubmit}
        onCancel={onCancel}
      />
    </div>
  );
}
