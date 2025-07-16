
import React from "react";
import { Button } from "@/components/ui/button";

interface BookingFormFooterProps {
  currentStep: number;
  maxSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function BookingFormFooter({ 
  currentStep, 
  maxSteps, 
  onPrevious, 
  onNext, 
  onSubmit, 
  onCancel,
  isSubmitting 
}: BookingFormFooterProps) {
  if (currentStep === maxSteps - 1) {
    return (
      <div className="flex justify-center border-t pt-6">
        <Button
          type="button"
          onClick={onCancel}
        >
          Return to Bookings
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-between border-t pt-6">
      <Button
        type="button"
        variant="outline"
        onClick={currentStep === 0 ? onCancel : onPrevious}
      >
        {currentStep === 0 ? "Cancel" : "Back"}
      </Button>
      
      {currentStep < maxSteps - 2 ? (
        <Button type="button" onClick={onNext}>
          Next
        </Button>
      ) : (
        <Button 
          type="button" 
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating Booking..." : "Complete Booking"}
        </Button>
      )}
    </div>
  );
}
