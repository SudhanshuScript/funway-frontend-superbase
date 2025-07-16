
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AbandonedCart } from "@/types/bookingTypes";
import { Archive } from "lucide-react";

interface ArchiveCartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCart: AbandonedCart | null;
  archiveReason: string;
  setArchiveReason: (reason: string) => void;
  onConfirmArchiveCart: () => Promise<void>;
}

export function ArchiveCartDialog({
  open,
  onOpenChange,
  selectedCart,
  archiveReason,
  setArchiveReason,
  onConfirmArchiveCart
}: ArchiveCartDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Archive Abandoned Cart</DialogTitle>
          <DialogDescription>
            This will move the cart to the archives. You can restore it later if needed.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="archive-cart-id" className="text-right">
              Cart ID
            </Label>
            <div className="col-span-3">
              <Input id="archive-cart-id" value={selectedCart?.id || ""} readOnly />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="archive-guest" className="text-right">
              Guest
            </Label>
            <div className="col-span-3">
              <Input id="archive-guest" value={selectedCart?.guestName || ""} readOnly />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="archive-reason" className="text-right">
              Reason
            </Label>
            <div className="col-span-3">
              <Select value={archiveReason} onValueChange={setArchiveReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no_response_after_multiple_attempts">No Response After Multiple Attempts</SelectItem>
                  <SelectItem value="guest_confirmed_no_interest">Guest Confirmed No Interest</SelectItem>
                  <SelectItem value="duplicate_booking">Duplicate Booking</SelectItem>
                  <SelectItem value="test_booking">Test Booking</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {archiveReason === 'other' && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="archive-notes" className="text-right">
                Notes
              </Label>
              <div className="col-span-3">
                <Textarea id="archive-notes" placeholder="Enter reason for archiving" />
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            variant="default" 
            onClick={onConfirmArchiveCart}
            disabled={!archiveReason}
          >
            <Archive className="mr-2 h-4 w-4" />
            Archive Cart
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
