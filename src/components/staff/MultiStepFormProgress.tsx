
import React from "react";
import { cn } from "@/lib/utils";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { CheckCircle2, Circle } from "lucide-react";

interface MultiStepFormProgressProps {
  steps: { id: string; label: string }[];
  currentStep: number;
}

export const MultiStepFormProgress = ({ steps, currentStep }: MultiStepFormProgressProps) => {
  return (
    <div className="mb-8">
      <Breadcrumb>
        <BreadcrumbList className="flex-wrap gap-1 sm:gap-2">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <BreadcrumbItem className={cn(
                "flex items-center text-sm",
                index <= currentStep 
                  ? "text-primary" 
                  : "text-muted-foreground"
              )}>
                <div className="flex items-center gap-1.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border">
                    {index < currentStep ? (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    ) : index === currentStep ? (
                      <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground/50" />
                    )}
                  </div>
                  <span>{step.label}</span>
                </div>
              </BreadcrumbItem>
              {index < steps.length - 1 && (
                <BreadcrumbSeparator />
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};
