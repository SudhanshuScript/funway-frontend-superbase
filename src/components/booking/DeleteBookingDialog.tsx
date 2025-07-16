
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface DeleteBookingDialogProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  onCancel: () => void;
  bookingId: string;
  bookingName: string;
}

export function DeleteBookingDialog({
  open,
  onClose,
  onDelete,
  onCancel,
  bookingId,
  bookingName
}: DeleteBookingDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Booking</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this booking? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Booking ID: <span className="font-medium">{bookingId}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Booking: <span className="font-medium">{bookingName}</span>
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button variant="destructive" onClick={onDelete}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
