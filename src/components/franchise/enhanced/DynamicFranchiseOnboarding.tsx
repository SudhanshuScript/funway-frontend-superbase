
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OnboardingProvider, useOnboarding } from './onboarding/OnboardingContext';
import StepRenderer from './onboarding/StepRenderer';
import OnboardingSteps from './onboarding/OnboardingSteps';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface FranchiseOnboardingProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const OnboardingContent: React.FC = () => {
  const { isSubmitting, moveToPreviousStep, handleSubmit, currentStep } = useOnboarding();
  
  return (
    <motion.div
      className="w-full max-w-5xl mx-auto space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="shadow-lg border-border/60">
        <div className="p-6 border-b border-border flex justify-between items-center bg-muted/50">
          <h1 className="text-2xl font-bold">Create New Franchise</h1>
          <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0" onClick={() => window.history.back()}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <CardContent className="pt-6 space-y-6">
          <OnboardingSteps />
          
          <div className="mt-4">
            <StepRenderer />
          </div>
          
          <div className="flex justify-between pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={moveToPreviousStep}
              disabled={currentStep === "franchise-identity" || isSubmitting}
            >
              {currentStep === "franchise-identity" ? "Cancel" : "Previous"}
            </Button>
            
            <Button 
              type="button" 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={currentStep === "review" ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">○</span>
                  Saving...
                </>
              ) : currentStep === "review" ? "Create Franchise" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const DynamicFranchiseOnboarding: React.FC<FranchiseOnboardingProps> = ({ onSuccess, onCancel }) => {
  return (
    <OnboardingProvider onSuccess={onSuccess} onCancel={onCancel}>
      <OnboardingContent />
    </OnboardingProvider>
  );
};

export default DynamicFranchiseOnboarding;
