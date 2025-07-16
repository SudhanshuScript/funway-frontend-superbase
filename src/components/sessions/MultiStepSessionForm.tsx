
import React, { useState } from "react";
import { Steps, Step } from "@/components/ui/steps";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { SessionInfoStep } from "./steps/SessionInfoStep";
import { CapacityPricingStep } from "./steps/CapacityPricingStep";
import { StaffLocationStep } from "./steps/StaffLocationStep";
import { ReviewPublishStep } from "./steps/ReviewPublishStep";

interface SessionFormData {
  sessionType: "regular" | "special";  // Explicitly defined as union type
  regularType?: string;
  specialName?: string;
  name: string;
  date: Date;
  startTime: string;
  duration: string;
  maxCapacity: number;
  pricePerPerson: number;
  addOnPackages: string[];
  staffAssigned: string[];
  franchiseLocation: string;
  notes: string;
  isRecurring?: boolean;
  recurringType?: string;
  recurringEndDate?: Date;
}

interface MultiStepSessionFormProps {
  onSubmit: (data: SessionFormData) => void;
  onCancel: () => void;
  initialData?: Partial<SessionFormData>;
}

export function MultiStepSessionForm({ 
  onSubmit, 
  onCancel, 
  initialData 
}: MultiStepSessionFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SessionFormData>({
    sessionType: initialData?.sessionType || "regular",
    regularType: initialData?.regularType || "",
    specialName: initialData?.specialName || "",
    name: initialData?.name || "",
    date: initialData?.date || new Date(),
    startTime: initialData?.startTime || "12:00",
    duration: initialData?.duration || "60",
    maxCapacity: initialData?.maxCapacity || 20,
    pricePerPerson: initialData?.pricePerPerson || 149.99,
    addOnPackages: initialData?.addOnPackages || [],
    staffAssigned: initialData?.staffAssigned || [],
    franchiseLocation: initialData?.franchiseLocation || "",
    notes: initialData?.notes || "",
    isRecurring: initialData?.isRecurring || false,
    recurringType: initialData?.recurringType || "weekly",
    recurringEndDate: initialData?.recurringEndDate,
  });

  const updateFormData = (data: Partial<SessionFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const isFirstStepValid = () => {
    if (formData.sessionType === "regular") {
      return !!formData.regularType && !!formData.name && !!formData.date && !!formData.startTime && !!formData.duration;
    } else {
      return !!formData.specialName && !!formData.name && !!formData.date && !!formData.startTime && !!formData.duration;
    }
  };

  const isSecondStepValid = () => {
    return formData.maxCapacity > 0 && formData.pricePerPerson > 0;
  };

  const isThirdStepValid = () => {
    return formData.staffAssigned.length > 0 && !!formData.franchiseLocation;
  };

  return (
    <div className="space-y-6">
      {/* Steps indicator */}
      <Steps currentStep={currentStep} className="my-6">
        <Step>Session Info</Step>
        <Step>Capacity & Pricing</Step>
        <Step>Staff & Location</Step>
        <Step>Review & Publish</Step>
      </Steps>

      {/* Form Steps */}
      <div className="mt-6">
        {currentStep === 1 && (
          <SessionInfoStep 
            formData={formData} 
            updateFormData={updateFormData}
          />
        )}

        {currentStep === 2 && (
          <CapacityPricingStep 
            formData={formData} 
            updateFormData={updateFormData}
          />
        )}

        {currentStep === 3 && (
          <StaffLocationStep 
            formData={formData} 
            updateFormData={updateFormData}
          />
        )}

        {currentStep === 4 && (
          <ReviewPublishStep formData={formData} />
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8 pt-4 border-t">
        <Button
          variant="outline"
          onClick={currentStep === 1 ? onCancel : handlePrevious}
        >
          {currentStep === 1 ? (
            "Cancel"
          ) : (
            <>
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </>
          )}
        </Button>
        
        {currentStep < 4 ? (
          <Button 
            onClick={handleNext}
            disabled={(currentStep === 1 && !isFirstStepValid()) || 
                     (currentStep === 2 && !isSecondStepValid()) || 
                     (currentStep === 3 && !isThirdStepValid())}
          >
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700"
          >
            Publish Session <Check className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
