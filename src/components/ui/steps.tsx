
import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface StepProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  completed?: boolean;
  icon?: React.ReactNode;
}

export const Step = React.forwardRef<HTMLDivElement, StepProps>(
  ({ active, completed, icon, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-2",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full border-2 text-center text-sm font-medium transition-colors",
            active && "border-primary bg-primary text-primary-foreground",
            completed && "border-primary bg-primary text-primary-foreground",
            !active && !completed && "border-muted-foreground/20 bg-background text-muted-foreground"
          )}
        >
          {completed ? (
            <Check className="h-4 w-4" />
          ) : (
            icon || <span>{children}</span>
          )}
        </div>
        <span
          className={cn(
            "text-sm font-medium",
            active && "text-foreground",
            !active && "text-muted-foreground"
          )}
        >
          {typeof children === "string" ? children : null}
        </span>
      </div>
    );
  }
);
Step.displayName = "Step";

export interface StepsProps extends React.HTMLAttributes<HTMLDivElement> {
  currentStep?: number;
  orientation?: "horizontal" | "vertical";
}

export const Steps = React.forwardRef<HTMLDivElement, StepsProps>(
  ({ currentStep = 0, orientation = "horizontal", className, children, ...props }, ref) => {
    const steps = React.Children.toArray(children);
    
    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "vertical" ? "flex-col gap-2" : "flex-row gap-4",
          className
        )}
        {...props}
      >
        {steps.map((step, index) => {
          if (React.isValidElement<StepProps>(step)) {
            return React.cloneElement(step, {
              active: currentStep === index,
              completed: currentStep > index,
              key: index
            });
          }
          return null;
        })}
      </div>
    );
  }
);
Steps.displayName = "Steps";
