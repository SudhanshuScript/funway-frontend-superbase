
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { PowerOff, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface DeactivateSessionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, comment?: string) => void | Promise<void>;
  session: any | null;
}

const deactivationReasons = [
  { id: "low-bookings", label: "Low bookings/interest" },
  { id: "maintenance", label: "Venue/equipment maintenance" },
  { id: "staffing", label: "Staffing issues" },
  { id: "weather", label: "Weather concerns" },
  { id: "operational", label: "Operational difficulties" },
  { id: "other", label: "Other reason (specify below)" }
];

export function DeactivateSessionDialog({
  isOpen,
  onClose,
  onConfirm,
  session
}: DeactivateSessionDialogProps) {
  const [selectedReason, setSelectedReason] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!session) return null;

  const handleSubmit = async () => {
    if (!selectedReason) return;
    
    setIsSubmitting(true);
    try {
      const reason = selectedReason === "other" 
        ? comment 
        : deactivationReasons.find(r => r.id === selectedReason)?.label || selectedReason;
        
      await onConfirm(reason, comment);
      resetForm();
    } catch (error) {
      console.error("Error deactivating session:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedReason("");
    setComment("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <PowerOff className="h-5 w-5" />
            Deactivate Session
          </DialogTitle>
          <DialogDescription>
            You are about to deactivate the session{" "}
            <span className="font-medium">{session.name}</span> on{" "}
            {format(new Date(session.date), "MMMM d, yyyy")} at {session.startTime}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-800">Important</p>
              <p className="text-amber-700">
                Deactivating this session will hide it from all booking interfaces and notify staff. Any existing bookings will need to be manually rescheduled.
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="deactivation-reason" className="text-base">Please provide a reason for deactivation *</Label>
            <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
              {deactivationReasons.map((reason) => (
                <div key={reason.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={reason.id} id={reason.id} />
                  <Label htmlFor={reason.id}>{reason.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="comment">Additional comments {selectedReason === "other" && "(required)"}</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Provide any additional details about this deactivation"
              rows={4}
              required={selectedReason === "other"}
            />
          </div>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleSubmit} 
            disabled={!selectedReason || (selectedReason === "other" && !comment) || isSubmitting}
            className="gap-1"
          >
            {isSubmitting ? "Processing..." : "Deactivate Session"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
