
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AbandonedCart } from "@/types/bookingTypes";
import { Tag } from "lucide-react";

interface DiscountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCart: AbandonedCart | null;
  discountPercentage: number;
  setDiscountPercentage: (percentage: number) => void;
  onConfirmOfferDiscount: () => Promise<void>;
}

export function DiscountDialog({
  open,
  onOpenChange,
  selectedCart,
  discountPercentage,
  setDiscountPercentage,
  onConfirmOfferDiscount
}: DiscountDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Offer Discount</DialogTitle>
          <DialogDescription>
            Create a discount code for this abandoned cart.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="discount-guest" className="text-right">
              Guest
            </Label>
            <div className="col-span-3">
              <Input id="discount-guest" value={selectedCart?.guestName || ""} readOnly />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="percentage" className="text-right">
              Discount %
            </Label>
            <div className="col-span-3">
              <Select 
                value={discountPercentage.toString()} 
                onValueChange={(value) => setDiscountPercentage(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select percentage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5%</SelectItem>
                  <SelectItem value="10">10%</SelectItem>
                  <SelectItem value="15">15%</SelectItem>
                  <SelectItem value="20">20%</SelectItem>
                  <SelectItem value="25">25%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="validity" className="text-right">
              Valid For
            </Label>
            <div className="col-span-3">
              <Input id="validity" value="7 days" readOnly />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirmOfferDiscount}>
            <Tag className="mr-2 h-4 w-4" />
            Create Discount
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
