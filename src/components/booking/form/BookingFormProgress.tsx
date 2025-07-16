
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BookingFormProgressProps {
  steps: { id: string; title: string }[];
  currentStep: number;
  onStepChange: (stepIndex: number) => void;
}

export function BookingFormProgress({ steps, currentStep, onStepChange }: BookingFormProgressProps) {
  const progress = Math.round((currentStep / (steps.length - 1)) * 100);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div className="text-sm text-muted-foreground">
          {currentStep < steps.length - 1 ? `Step ${currentStep + 1} of ${steps.length - 1}` : "Complete!"}
        </div>
      </div>
      
      <div className="w-full bg-muted rounded-full h-2 mb-4">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <Tabs 
        value={steps[currentStep].id} 
        className="w-full"
        onValueChange={(value) => {
          const stepIndex = steps.findIndex(step => step.id === value);
          if (stepIndex !== -1 && stepIndex < currentStep) {
            onStepChange(stepIndex);
          }
        }}
      >
        <TabsList className="w-full grid grid-cols-3 mb-2">
          {steps.slice(0, 3).map((step, index) => (
            <TabsTrigger
              key={step.id}
              value={step.id}
              disabled={index > currentStep}
              className={index <= currentStep ? "cursor-pointer" : "cursor-not-allowed"}
            >
              {step.title}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </>
  );
}
