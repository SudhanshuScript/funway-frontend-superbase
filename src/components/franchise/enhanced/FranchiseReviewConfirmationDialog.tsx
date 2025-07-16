
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { EnhancedFranchise } from '@/types/franchiseManagement';
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Label } from '@/components/ui/label';

interface FranchiseReviewConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  franchise: EnhancedFranchise;
  type: 'approve' | 'decline';
  onConfirm: (reason?: string) => void;
  isProcessing: boolean;
  internalNotes: string;
}

const DECLINE_REASONS = [
  "Incomplete Documentation",
  "Invalid Business Information",
  "Failed Verification",
  "Duplicate Application",
  "Location Restrictions",
  "Policy Violations",
  "Other"
];

export const FranchiseReviewConfirmationDialog: React.FC<FranchiseReviewConfirmationDialogProps> = ({
  open,
  onOpenChange,
  franchise,
  type,
  onConfirm,
  isProcessing,
  internalNotes
}) => {
  const [declineReason, setDeclineReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");
  
  const handleConfirm = () => {
    if (type === 'decline') {
      const finalReason = declineReason === 'Other' ? customReason : declineReason;
      onConfirm(finalReason);
    } else {
      onConfirm();
    }
  };
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-[900px] max-h-[95vh] overflow-y-auto overflow-x-hidden">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {type === 'approve' ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>Approve Franchise Application</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-red-500" />
                <span>Decline Franchise Application</span>
              </>
            )}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {type === 'approve' ? (
              <>
                You are about to approve the franchise application for <strong>{franchise.name || franchise.company_name}</strong>. 
                This will grant access to the franchise owner and enable all franchise features.
              </>
            ) : (
              <>
                You are about to decline the franchise application for <strong>{franchise.name || franchise.company_name}</strong>. 
                The franchise owner will be notified about this decision.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        {type === 'decline' && (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="decline-reason">Reason for declining</Label>
              <Select value={declineReason} onValueChange={setDeclineReason}>
                <SelectTrigger id="decline-reason">
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Reasons</SelectLabel>
                    {DECLINE_REASONS.map(reason => (
                      <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            {declineReason === 'Other' && (
              <div className="space-y-2">
                <Label htmlFor="custom-reason">Custom reason</Label>
                <Textarea 
                  id="custom-reason"
                  placeholder="Please specify the reason for declining this application..."
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  rows={3}
                />
              </div>
            )}
            
            <div className="rounded-md bg-amber-50 p-3 border border-amber-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <p className="text-sm font-medium text-amber-800">This action will notify the franchise owner</p>
              </div>
              <p className="text-xs text-amber-700 mt-1">
                The owner will receive an email with the reason for declining their application.
                Make sure your reason is clear and professional.
              </p>
            </div>
          </div>
        )}
        
        <AlertDialogFooter className="mt-6 gap-3">
          <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            disabled={isProcessing || (type === 'decline' && !declineReason) || (type === 'decline' && declineReason === 'Other' && !customReason)}
            className={type === 'approve' ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' : 'bg-destructive hover:bg-destructive/90'}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-white border-opacity-20 border-t-white rounded-full"></span>
                Processing...
              </span>
            ) : (
              <>
                {type === 'approve' ? 'Approve Franchise' : 'Decline Application'}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
