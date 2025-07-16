
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MultiStepSessionForm } from "./MultiStepSessionForm";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface SessionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: any) => Promise<void> | void;
  initialDate?: Date;
  session?: any;
}

export function SessionDialog({
  isOpen,
  onClose,
  onSave,
  initialDate,
  session
}: SessionDialogProps) {
  const { toast } = useToast();

  const handleSubmit = async (formData: any) => {
    try {
      await onSave(formData);
      toast({
        description: "Session published successfully",
      });
    } catch (error) {
      console.error("Error saving session:", error);
      toast({
        variant: "destructive",
        description: "Failed to publish session",
      });
    }
  };

  // Prepare initial data when editing a session
  const getInitialData = () => {
    if (!session) {
      return {
        sessionType: "regular" as const,  // Using 'as const' to ensure the correct type
        date: initialDate || new Date(),
      };
    }

    // Format session data for the form when editing
    return {
      sessionType: session.isSpecialDate ? "special" as const : "regular" as const,  // Using 'as const' for type safety
      regularType: !session.isSpecialDate ? session.name : "",
      specialName: session.isSpecialDate ? session.name : "",
      name: session.name,
      date: new Date(session.date),
      startTime: session.startTime,
      duration: String(session.duration),
      maxCapacity: session.maxCapacity,
      pricePerPerson: session.specialPricing || 149.99,
      addOnPackages: session.specialAddOns || [],
      staffAssigned: [], // Would need to load from session data
      franchiseLocation: "", // Would need to load from session data
      notes: session.specialConditions || "",
    };
  };

  const dialogTitle = session
    ? `Edit Session: ${session.name}`
    : "Publish New Session";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <MultiStepSessionForm 
          onSubmit={handleSubmit}
          onCancel={onClose}
          initialData={getInitialData()}
        />
      </DialogContent>
    </Dialog>
  );
}
