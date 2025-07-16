
import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuditLogger } from "@/utils/auditLogger";
import { format } from "date-fns";

// Import types and utilities
import { 
  BookingFormProps, 
  BookingFormValues, 
  bookingFormSchema, 
  BOOKING_FORM_STEPS 
} from "./MultiStepBookingFormTypes";
import { getFieldsForStep } from "./form/useBookingFormFields";
import { BookingFormProgress } from "./form/BookingFormProgress";
import { BookingFormFooter } from "./form/BookingFormFooter";

// Step components
import { SessionDetailsStep } from "./steps/SessionDetailsStep";
import { GuestDetailsStep } from "./steps/GuestDetailsStep";
import { PaymentSummaryStep } from "./steps/PaymentSummaryStep";
import { BookingSuccess } from "./steps/BookingSuccess";

export function MultiStepBookingForm({ onSubmit, onCancel, initialValues }: BookingFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { logEvent } = useAuditLogger();
  
  const methods = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      experienceDate: initialValues?.experienceDate || new Date(),
      sessionType: initialValues?.sessionType || "dinner",
      guestName: initialValues?.guestName || "",
      contactNumber: initialValues?.contactNumber || "",
      email: initialValues?.email || "",
      customerType: initialValues?.customerType || "First-Time",
      numberOfGuests: initialValues?.numberOfGuests || 2,
      totalGuests: initialValues?.numberOfGuests || 2,
      vegCount: initialValues?.vegCount || 0,
      nonVegCount: initialValues?.nonVegCount || 2,
      paymentStatus: initialValues?.paymentStatus || "Unpaid",
      paymentMethod: initialValues?.paymentMethod || "cash",
      bookingStatus: initialValues?.bookingStatus || "Confirmed",
      offerCode: initialValues?.offerCode || "none",
      specialRequests: initialValues?.specialRequests || "",
      bookingDate: initialValues?.bookingDate || format(new Date(), "yyyy-MM-dd"),
      bookingTime: initialValues?.bookingTime || "19:00",
      sessionName: initialValues?.sessionName || "Dinner",
      addonPackage: initialValues?.addonPackage || "none",
    },
  });
  
  const handleNext = async () => {
    const fields = getFieldsForStep(currentStep);
    
    const isValid = await methods.trigger(fields);
    if (!isValid) {
      toast.error("Please fill all required fields correctly");
      return;
    }
    
    logEvent("form", "multi_step_booking", "next_step", {
      step: currentStep,
      stepName: BOOKING_FORM_STEPS[currentStep].id,
    });
    
    setCurrentStep((prev) => Math.min(prev + 1, BOOKING_FORM_STEPS.length - 1));
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      logEvent("form", "multi_step_booking", "prev_step", {
        step: currentStep,
        stepName: BOOKING_FORM_STEPS[currentStep].id,
      });
      
      setCurrentStep((prev) => Math.max(prev - 1, 0));
    }
  };
  
  const handleFormSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    
    logEvent("form", "multi_step_booking", "submit", {
      formData: {...data, cardNumber: "****", cardCvv: "***"}
    });
    
    try {
      await onSubmit(data);
      setCurrentStep(3);
      toast.success("Booking created successfully!");
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Failed to create booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <FormProvider {...methods}>
      <Card className="w-full max-w-4xl mx-auto shadow-lg">
        <CardHeader className="bg-muted/50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <CardTitle>Create New Booking</CardTitle>
          </div>
          
          <BookingFormProgress 
            steps={BOOKING_FORM_STEPS} 
            currentStep={currentStep} 
            onStepChange={setCurrentStep} 
          />
        </CardHeader>
        
        <CardContent className="pt-6">
          <form onSubmit={methods.handleSubmit(handleFormSubmit)}>
            {currentStep === 0 && <SessionDetailsStep />}
            {currentStep === 1 && <GuestDetailsStep />}
            {currentStep === 2 && <PaymentSummaryStep />}
            {currentStep === 3 && <BookingSuccess />}
          </form>
        </CardContent>
        
        <CardFooter>
          <BookingFormFooter 
            currentStep={currentStep}
            maxSteps={BOOKING_FORM_STEPS.length}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSubmit={methods.handleSubmit(handleFormSubmit)}
            onCancel={onCancel}
            isSubmitting={isSubmitting}
          />
        </CardFooter>
      </Card>
    </FormProvider>
  );
}

export type { BookingFormValues } from './MultiStepBookingFormTypes';
