
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Loader2 } from "lucide-react";
import { InactivityReason } from "@/types/franchiseManagement";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type ShutdownDialogProps = {
  open: boolean;
  franchiseId: string;
  franchiseName: string;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

const reasonOptions: InactivityReason[] = [
  "Payment Pending",
  "Maintenance",
  "Legal Issue",
  "Owner Request",
];

export function EnhancedFranchiseShutdownDialog({
  open,
  franchiseId,
  franchiseName,
  onOpenChange,
  onSuccess,
}: ShutdownDialogProps) {
  const [selectedReason, setSelectedReason] = useState<InactivityReason>(null);
  const [shutdownNotes, setShutdownNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleShutdown = async () => {
    if (!selectedReason) {
      toast.error("Please select a reason for shutdown");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("franchises")
        .update({ 
          status: "inactive", 
          inactivity_reason: selectedReason,
          shutdown_reason: shutdownNotes || null
        })
        .eq("id", franchiseId);

      if (error) throw error;

      toast.success(`Franchise "${franchiseName}" has been shut down`);
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Error shutting down franchise:", error);
      toast.error("Failed to shut down franchise");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-red-500">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Shut Down Franchise
          </DialogTitle>
          <DialogDescription>
            You are about to shut down <span className="font-semibold text-foreground">{franchiseName}</span>. 
            This will mark the franchise as inactive and it will no longer be operational.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="reason" className="text-sm font-medium">
              Reason for shutdown<span className="text-red-500">*</span>
            </label>
            <Select
              value={selectedReason || ""}
              onValueChange={(value) => setSelectedReason(value as InactivityReason)}
            >
              <SelectTrigger id="reason">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {reasonOptions.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Additional notes
            </label>
            <Textarea
              id="notes"
              value={shutdownNotes}
              onChange={(e) => setShutdownNotes(e.target.value)}
              placeholder="Enter any additional details about why this franchise is being shut down"
              rows={4}
            />
          </div>

          <div className="bg-muted/50 p-4 rounded-md">
            <h4 className="font-medium mb-2 flex items-center">
              <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
              What happens when a franchise is shut down?
            </h4>
            <ul className="space-y-1 text-sm text-muted-foreground ml-6 list-disc">
              <li>The franchise will be marked as inactive</li>
              <li>Staff will no longer be able to access the system</li>
              <li>Booking and payment processing will be disabled</li>
              <li>Franchise data will be preserved for future reference</li>
              <li>You can reactivate the franchise at any time</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleShutdown}
            disabled={!selectedReason || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Shutting Down...
              </>
            ) : (
              <>Confirm Shutdown</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EnhancedFranchiseShutdownDialog;
