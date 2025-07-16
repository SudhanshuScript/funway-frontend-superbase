
import React from 'react';
import { useOnboarding } from './OnboardingContext';
import { cn } from '@/lib/utils';
import { OnboardingStepKey, stepInfo } from './constants';
import { Check } from 'lucide-react';

const OnboardingSteps: React.FC = () => {
  const { currentStep, setCurrentStep, getStepProgress } = useOnboarding();
  
  // Calculate current step index for progress display
  const currentStepIndex = stepInfo.findIndex(step => step.key === currentStep);
  const progress = getStepProgress();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">
            Step {currentStepIndex + 1} of {stepInfo.length}: {stepInfo[currentStepIndex].label}
          </h3>
          <span className="text-sm text-muted-foreground">{progress}% Complete</span>
        </div>
        
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        <div className="grid grid-cols-7">
          {stepInfo.map((step, index) => {
            const isComplete = index < currentStepIndex;
            const isCurrent = currentStep === step.key;
            
            return (
              <button
                key={step.key}
                className={cn(
                  "py-2 px-4 text-center text-sm transition-colors relative",
                  isCurrent 
                    ? "bg-primary/10 text-primary font-medium border-b-2 border-primary" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                  index <= currentStepIndex && "cursor-pointer"
                )}
                disabled={index > currentStepIndex}
                onClick={() => {
                  if (index <= currentStepIndex) {
                    setCurrentStep(step.key as OnboardingStepKey);
                  }
                }}
              >
                {isComplete ? (
                  <div className="flex items-center justify-center">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                ) : (
                  <span>{index + 1}</span>
                )}
                <span className={cn(
                  "absolute bottom-0 left-0 right-0 text-[10px] hidden md:block", 
                  isCurrent ? "text-primary" : "text-muted-foreground"
                )}>
                  {step.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OnboardingSteps;
