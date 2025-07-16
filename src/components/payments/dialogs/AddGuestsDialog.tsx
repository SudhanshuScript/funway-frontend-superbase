
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Transaction } from '../types';

interface AddGuestsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTransaction: Transaction | null;
  newGuestCount: number;
  setNewGuestCount: (count: number) => void;
  additionalAmount: number;
  calculateAdditionalAmount: (count: number) => number;
  onConfirm: () => void;
}

export function AddGuestsDialog({
  open,
  onOpenChange,
  selectedTransaction,
  newGuestCount,
  setNewGuestCount,
  additionalAmount,
  calculateAdditionalAmount,
  onConfirm
}: AddGuestsDialogProps) {
  const handleNewGuestCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value) || 0;
    setNewGuestCount(count);
    calculateAdditionalAmount(count);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Additional Guests</DialogTitle>
          <DialogDescription>
            Add guests to the booking and collect additional payment.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="booking">Booking</Label>
            <div className="font-medium">
              {selectedTransaction?.bookingId} - {selectedTransaction?.customer}
            </div>
            <div className="text-sm text-muted-foreground">
              Current Guests: {selectedTransaction?.totalGuests}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="additionalGuests">Additional Guests</Label>
            <Input
              id="additionalGuests"
              type="number"
              min="1"
              value={newGuestCount || ''}
              onChange={handleNewGuestCountChange}
              className="text-spotBooking border-spotBooking/30 focus-visible:ring-spotBooking"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="additionalAmount">Additional Charge</Label>
            <div className="font-medium text-lg text-spotBooking">
              ${additionalAmount.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">
              Based on per-guest rate of ${selectedTransaction ? 
                (selectedTransaction.amount / selectedTransaction.totalGuests).toFixed(2) : '0.00'}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="spotBooking" onClick={onConfirm}>
            Confirm Payment and Add Guests
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
