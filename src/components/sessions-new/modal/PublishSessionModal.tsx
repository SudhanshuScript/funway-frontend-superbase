
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Step, Steps } from '@/components/ui/steps';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Session } from '@/types';
import { SessionBasicStep } from '../publish-steps/SessionBasicStep';
import { SessionCapacityStep } from '../publish-steps/SessionCapacityStep';
import { SessionStaffStep } from '../publish-steps/SessionStaffStep';
import { SessionReviewStep } from '../publish-steps/SessionReviewStep';
import { toast } from 'sonner';

interface PublishSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSession?: Session | null;
  onPublish: (session: Partial<Session>) => Promise<boolean>;
}

export interface SessionFormData {
  id?: string;
  sessionType: "regular" | "special";
  regularType?: string;
  specialName?: string;
  name: string;
  date: string;
  startTime: string;
  duration: number;
  maxCapacity: number;
  pricePerPerson: number;
  addOnPackages: string[];
  staffAssigned: string[];
  franchiseLocation: string;
  notes: string;
  isRecurring?: boolean;
  recurringType?: string;
  recurringEndDate?: string;
  type: string;
  isSpecialDate?: boolean;
  specialDateName?: string;
  specialAddOns?: string[];
  specialConditions?: string;
  specialPricing?: number;
  isActive?: boolean;
}

export function PublishSessionModal({
  isOpen,
  onClose,
  initialSession,
  onPublish,
}: PublishSessionModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<SessionFormData>(() => {
    if (initialSession) {
      return {
        id: initialSession.id,
        sessionType: initialSession.isSpecialDate ? "special" : "regular",
        regularType: !initialSession.isSpecialDate ? initialSession.type : '',
        specialName: initialSession.isSpecialDate ? initialSession.name : '',
        name: initialSession.name,
        date: initialSession.date,
        startTime: initialSession.startTime,
        duration: initialSession.duration,
        maxCapacity: initialSession.maxCapacity,
        pricePerPerson: initialSession.specialPricing || 149.99,
        addOnPackages: initialSession.specialAddOns || [],
        staffAssigned: [],
        franchiseLocation: '',
        notes: initialSession.notes || initialSession.specialConditions || '',
        type: initialSession.type,
        isSpecialDate: initialSession.isSpecialDate,
        specialDateName: initialSession.specialDateName,
        specialAddOns: initialSession.specialAddOns,
        specialConditions: initialSession.specialConditions,
        specialPricing: initialSession.specialPricing,
        isActive: initialSession.isActive,
      };
    }
    
    return {
      sessionType: "regular",
      name: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '12:00',
      duration: 60,
      maxCapacity: 20,
      pricePerPerson: 149.99,
      addOnPackages: [],
      staffAssigned: [],
      franchiseLocation: '',
      notes: '',
      type: '',
      isSpecialDate: false
    };
  });
  
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
  
  const handleFormChange = (data: Partial<SessionFormData>) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }));
  };
  
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      const sessionData: Partial<Session> = {
        id: formData.id,
        name: formData.name,
        type: formData.sessionType === 'regular' ? formData.regularType! : 'special',
        date: formData.date,
        startTime: formData.startTime,
        duration: formData.duration,
        maxCapacity: formData.maxCapacity,
        isSpecialDate: formData.sessionType === 'special',
        specialDateName: formData.sessionType === 'special' ? formData.specialName : undefined,
        specialPricing: formData.pricePerPerson,
        specialAddOns: formData.addOnPackages,
        specialConditions: formData.notes,
        notes: formData.notes,
        isActive: true,
      };
      
      const result = await onPublish(sessionData);
      
      if (result) {
        toast.success(`Session ${formData.id ? 'updated' : 'published'} successfully`);
        onClose();
        // Reset form if needed
        setFormData({
          sessionType: "regular",
          name: '',
          date: new Date().toISOString().split('T')[0],
          startTime: '12:00',
          duration: 60,
          maxCapacity: 20,
          pricePerPerson: 149.99,
          addOnPackages: [],
          staffAssigned: [],
          franchiseLocation: '',
          notes: '',
          type: '',
          isSpecialDate: false
        });
        setCurrentStep(1);
      }
    } catch (error) {
      console.error('Error publishing session:', error);
      toast.error('Failed to publish session');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const isFirstStepValid = () => {
    if (formData.sessionType === 'regular') {
      return !!formData.regularType && !!formData.name && !!formData.date && !!formData.startTime;
    } else {
      return !!formData.specialName && !!formData.name && !!formData.date && !!formData.startTime;
    }
  };
  
  const isSecondStepValid = () => {
    return formData.maxCapacity > 0 && formData.pricePerPerson > 0;
  };
  
  const isThirdStepValid = () => {
    return true; // Staff assignment is optional in this implementation
  };
  
  const handleCloseResetForm = () => {
    // Only reset if not editing an existing session
    if (!initialSession) {
      setFormData({
        sessionType: "regular",
        name: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '12:00',
        duration: 60,
        maxCapacity: 20,
        pricePerPerson: 149.99,
        addOnPackages: [],
        staffAssigned: [],
        franchiseLocation: '',
        notes: '',
        type: '',
        isSpecialDate: false
      });
      setCurrentStep(1);
    }
    
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleCloseResetForm}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>
            {initialSession ? 'Edit Session' : 'Publish New Session'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <Steps currentStep={currentStep} className="mb-8">
            <Step>Basic Info</Step>
            <Step>Capacity & Pricing</Step>
            <Step>Staff & Add-ons</Step>
            <Step>Review & Publish</Step>
          </Steps>
          
          <div className="mt-8">
            {currentStep === 1 && (
              <SessionBasicStep formData={formData} onFormChange={handleFormChange} />
            )}
            {currentStep === 2 && (
              <SessionCapacityStep formData={formData} onFormChange={handleFormChange} />
            )}
            {currentStep === 3 && (
              <SessionStaffStep formData={formData} onFormChange={handleFormChange} />
            )}
            {currentStep === 4 && (
              <SessionReviewStep formData={formData} />
            )}
          </div>
        </div>
        
        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={currentStep === 1 ? handleCloseResetForm : handlePrevious}
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
              className="bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <>
                  Publish Session <Check className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
