
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import OfferBasicsStep from './wizard/OfferBasicsStep';
import OfferDetailsStep from './wizard/OfferDetailsStep';
import OfferTargetingStep from './wizard/OfferTargetingStep';
import OfferPreviewStep from './wizard/OfferPreviewStep';
import { OfferFormData } from '@/types/offerTypes';

interface OfferCreationWizardProps {
  onClose: () => void;
}

const OfferCreationWizard = ({ onClose }: OfferCreationWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OfferFormData>({
    name: '',
    type: 'Custom',
    code: '',
    discountType: 'Percentage',
    discountValue: 0,
    validFrom: new Date(),
    validTo: new Date(),
    validityType: 'All Days',
    maxRedemptions: 100,
    perGuestLimit: 1,
    guestSegments: ['All'],
    franchiseIds: ['all'],
    deliveryChannels: ['All'],
    sessionIds: [],
    status: 'Draft'
  });

  const steps = [
    {
      id: 1,
      name: "Offer Basics",
      description: "Set name, type and code"
    },
    {
      id: 2,
      name: "Offer Details",
      description: "Set discount value and validity"
    },
    {
      id: 3,
      name: "Targeting",
      description: "Choose segments and channels"
    },
    {
      id: 4,
      name: "Review & Publish",
      description: "Preview and activate"
    }
  ];

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.name || !formData.code) {
        toast.error("Please fill in all required fields");
        return;
      }
    } else if (currentStep === 2) {
      if (formData.discountValue <= 0) {
        toast.error("Please set a valid discount value");
        return;
      }
    }
    
    setCurrentStep(current => Math.min(steps.length, current + 1));
  };

  const handleBack = () => {
    setCurrentStep(current => Math.max(1, current - 1));
  };

  const handleSubmit = () => {
    // Here we would make the API call to create the offer
    toast.success("Offer created successfully");
    onClose();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Create New Offer</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center justify-between mt-4">
          {steps.map((step) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.id < currentStep ? 'bg-primary text-primary-foreground' : 
                    step.id === currentStep ? 'border-2 border-primary text-primary' : 
                    'border-2 border-gray-300 text-gray-400'
                  }`}
                >
                  {step.id < currentStep ? <Check className="h-4 w-4" /> : step.id}
                </div>
                <div className="mt-2 text-center">
                  <p className="font-medium text-sm">{step.name}</p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
              </div>
              
              {step.id < steps.length && (
                <div className="w-16 h-[2px] bg-gray-200">
                  {step.id < currentStep && (
                    <div className="h-full bg-primary" style={{ width: '100%' }} />
                  )}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="py-4">
          {currentStep === 1 && (
            <OfferBasicsStep 
              formData={formData}
              updateFormData={setFormData}
            />
          )}
          {currentStep === 2 && (
            <OfferDetailsStep 
              formData={formData}
              updateFormData={setFormData}
            />
          )}
          {currentStep === 3 && (
            <OfferTargetingStep 
              formData={formData}
              updateFormData={setFormData}
            />
          )}
          {currentStep === 4 && (
            <OfferPreviewStep 
              formData={formData}
              updateFormData={setFormData}
            />
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={currentStep === 1 ? onClose : handleBack}
        >
          {currentStep === 1 ? 'Cancel' : (
            <>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </>
          )}
        </Button>
        <Button 
          onClick={currentStep === steps.length ? handleSubmit : handleNext}
        >
          {currentStep === steps.length ? 'Submit' : (
            <>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OfferCreationWizard;
