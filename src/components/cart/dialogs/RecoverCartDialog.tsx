
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AbandonedCart } from "@/types/bookingTypes";
import { ArrowUpRight } from "lucide-react";
import { format, parseISO } from 'date-fns';

interface RecoverCartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCart: AbandonedCart | null;
  onConfirmRecoverCart: () => Promise<void>;
}

export function RecoverCartDialog({
  open,
  onOpenChange,
  selectedCart,
  onConfirmRecoverCart
}: RecoverCartDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Convert to Booking</DialogTitle>
          <DialogDescription>
            This will convert the abandoned cart into a confirmed booking.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="recover-cart-id" className="text-right">
              Cart ID
            </Label>
            <div className="col-span-3">
              <Input id="recover-cart-id" value={selectedCart?.id || ""} readOnly />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="recover-guest" className="text-right">
              Guest
            </Label>
            <div className="col-span-3">
              <Input id="recover-guest" value={selectedCart?.guestName || ""} readOnly />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="recover-session" className="text-right">
              Session
            </Label>
            <div className="col-span-3">
              <Input id="recover-session" value={selectedCart?.sessionName || ""} readOnly />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="recover-date" className="text-right">
              Date
            </Label>
            <div className="col-span-3">
              <Input id="recover-date" value={selectedCart?.bookingDate || ""} readOnly />
            </div>
          </div>
          {selectedCart?.discountOffered && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="recover-discount" className="text-right">
                Discount
              </Label>
              <div className="col-span-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                    {selectedCart.discountOffered.code} ({selectedCart.discountOffered.percentage}%)
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Expires: {format(parseISO(selectedCart.discountOffered.expiry), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirmRecoverCart}>
            <ArrowUpRight className="mr-2 h-4 w-4" />
            Convert to Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
