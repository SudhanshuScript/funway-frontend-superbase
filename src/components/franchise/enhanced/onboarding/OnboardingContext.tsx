
import React, { createContext, useContext, useState } from 'react';
import { FranchiseFormData, OnboardingStep } from '@/types/franchiseManagement';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useUserRole } from '@/providers/UserRoleProvider';
import { useAuditLogger } from '@/utils/auditLogger';

interface OnboardingContextType {
  currentStep: OnboardingStep;
  formData: FranchiseFormData;
  isSubmitting: boolean;
  setCurrentStep: (step: OnboardingStep) => void;
  handleInputChange: (field: keyof FranchiseFormData, value: any) => void;
  moveToNextStep: () => void;
  moveToPreviousStep: () => void;
  validateCurrentStep: () => boolean;
  getStepProgress: () => number;
  handleSubmit: () => Promise<void>;
}

const defaultFormData: FranchiseFormData = {
  name: "",
  owner_name: "",
  owner_email: "",
  contact_number: "",
  company_name: "",
  tax_id: "",
  address: "",
  city: "",
  state: "",
  country: "",
  tax_percentage: 0,
  tax_inclusive: false,
  timezone: "America/New_York",
  currency: "USD",
  status: "pending_review",
  payment_gateway: "Stripe",
  
  // Initialize operating hours
  monday_start: "09:00",
  monday_end: "17:00",
  tuesday_start: "09:00",
  tuesday_end: "17:00",
  wednesday_start: "09:00",
  wednesday_end: "17:00",
  thursday_start: "09:00",
  thursday_end: "17:00",
  friday_start: "09:00",
  friday_end: "17:00",
  saturday_start: "10:00", 
  saturday_end: "15:00",
  sunday_start: "Closed",
  sunday_end: "Closed"
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

interface OnboardingProviderProps {
  children: React.ReactNode;
  onSuccess: () => void;
  onCancel: () => void;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ 
  children, 
  onSuccess,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("franchise-identity");
  const [formData, setFormData] = useState<FranchiseFormData>(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser } = useUserRole();
  const { logEvent } = useAuditLogger();

  const handleInputChange = (field: keyof FranchiseFormData, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const moveToNextStep = () => {
    if (!validateCurrentStep()) {
      return;
    }

    switch (currentStep) {
      case "franchise-identity":
        setCurrentStep("location-address");
        break;
      case "location-address":
        setCurrentStep("registration");
        break;
      case "registration":
        setCurrentStep("brand-appearance");
        break;
      case "brand-appearance":
        setCurrentStep("hours-setup");
        break;
      case "hours-setup":
        setCurrentStep("operational-setup");
        break;
      case "operational-setup":
        setCurrentStep("review");
        break;
      default:
        break;
    }
  };

  const moveToPreviousStep = () => {
    switch (currentStep) {
      case "location-address":
        setCurrentStep("franchise-identity");
        break;
      case "registration":
        setCurrentStep("location-address");
        break;
      case "brand-appearance":
        setCurrentStep("registration");
        break;
      case "hours-setup":
        setCurrentStep("brand-appearance");
        break;
      case "operational-setup":
        setCurrentStep("hours-setup");
        break;
      case "review":
        setCurrentStep("operational-setup");
        break;
      default:
        break;
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case "franchise-identity":
        if (!formData.name) {
          toast.error("Franchise name is required");
          return false;
        }
        if (!formData.owner_name) {
          toast.error("Owner name is required");
          return false;
        }
        if (!formData.owner_email) {
          toast.error("Owner email is required");
          return false;
        }
        if (!formData.contact_number) {
          toast.error("Contact number is required");
          return false;
        }
        return true;

      case "location-address":
        if (!formData.address) {
          toast.error("Address is required");
          return false;
        }
        if (!formData.city) {
          toast.error("City is required");
          return false;
        }
        if (!formData.state) {
          toast.error("State is required");
          return false;
        }
        if (!formData.country) {
          toast.error("Country is required");
          return false;
        }
        return true;

      case "registration":
        if (!formData.tax_id) {
          toast.error("Tax ID is required");
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const getStepProgress = () => {
    const steps: OnboardingStep[] = [
      "franchise-identity",
      "location-address",
      "registration",
      "brand-appearance",
      "hours-setup",
      "operational-setup",
      "review"
    ];
    
    const currentIndex = steps.findIndex(step => step === currentStep);
    return Math.round(((currentIndex + 1) / steps.length) * 100);
  };

  const handleSubmit = async () => {
    if (currentStep !== "review") {
      moveToNextStep();
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('franchises')
        .insert({
          name: formData.name,
          owner_name: formData.owner_name,
          owner_email: formData.owner_email,
          email: formData.owner_email,
          contact_number: formData.contact_number,
          company_name: formData.company_name || formData.name,
          tax_id: formData.tax_id,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          tax_percentage: formData.tax_percentage,
          tax_inclusive: formData.tax_inclusive,
          timezone: formData.timezone,
          currency: formData.currency,
          welcome_message: formData.welcome_message,
          theme_color: formData.theme_color,
          status: formData.status,
          website: formData.website,
          instagram: formData.instagram,
          payment_gateway: formData.payment_gateway,
          // Add operating hours
          monday_start: formData.monday_start,
          monday_end: formData.monday_end,
          tuesday_start: formData.tuesday_start,
          tuesday_end: formData.tuesday_end,
          wednesday_start: formData.wednesday_start,
          wednesday_end: formData.wednesday_end,
          thursday_start: formData.thursday_start,
          thursday_end: formData.thursday_end,
          friday_start: formData.friday_start,
          friday_end: formData.friday_end,
          saturday_start: formData.saturday_start,
          saturday_end: formData.saturday_end,
          sunday_start: formData.sunday_start,
          sunday_end: formData.sunday_end
        })
        .select();

      if (error) {
        throw error;
      }

      if (data && data[0] && currentUser) {
        logEvent("franchises", data[0].id, "created", {
          creator: currentUser.id,
          franchiseData: { ...formData, owner_id: currentUser.id }
        });
      }

      toast.success("Franchise created successfully!");
      onSuccess();
    } catch (error: any) {
      console.error("Error creating franchise:", error);
      toast.error(`Failed to create franchise: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const value = {
    currentStep,
    formData,
    isSubmitting,
    setCurrentStep,
    handleInputChange,
    moveToNextStep,
    moveToPreviousStep,
    validateCurrentStep,
    getStepProgress,
    handleSubmit,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = (): OnboardingContextType => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
