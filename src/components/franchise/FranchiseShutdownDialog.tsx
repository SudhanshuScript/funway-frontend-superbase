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
import { InactivityReason } from "@/types/franchiseTypes";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuditLogger } from "@/utils/auditLogger";

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

export function FranchiseShutdownDialog({
  open,
  franchiseId,
  franchiseName,
  onOpenChange,
  onSuccess,
}: ShutdownDialogProps) {
  const [selectedReason, setSelectedReason] = useState<InactivityReason>(null);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { logEvent } = useAuditLogger();

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
          inactivity_reason: selectedReason 
        })
        .eq("id", franchiseId);

      if (error) throw error;

      logEvent("franchises", franchiseId, "updated", {
        status: "inactive",
        reason: selectedReason,
        notes: additionalNotes,
      });

      toast.success("Franchise has been shut down");
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-destructive mr-2" />
            Shut Down Franchise
          </DialogTitle>
          <DialogDescription>
            You are about to shut down <span className="font-semibold">{franchiseName}</span>. This will mark the franchise as inactive.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="reason" className="text-sm font-medium">
              Reason for shutdown*
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
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Enter any additional details or context"
              rows={3}
            />
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

export default FranchiseShutdownDialog;
