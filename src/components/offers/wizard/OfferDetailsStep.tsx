
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Info } from "lucide-react";
import { Button } from '@/components/ui/button';
import { format, addDays } from 'date-fns';
import { OfferFormData } from '@/types/offerTypes';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface OfferDetailsStepProps {
  formData: OfferFormData;
  updateFormData: (data: OfferFormData) => void;
}

const OfferDetailsStep = ({ formData, updateFormData }: OfferDetailsStepProps) => {
  const handleDiscountTypeChange = (value: string) => {
    updateFormData({
      ...formData,
      discountType: value as any,
      // Reset discount value when changing type
      discountValue: 0
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center">
          <Label htmlFor="discountType">Discount Type <span className="text-red-500">*</span></Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="ml-2 h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Choose how the discount will be applied: as a percentage of the total, a fixed amount, or a free add-on
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Select 
          value={formData.discountType} 
          onValueChange={handleDiscountTypeChange}
        >
          <SelectTrigger id="discountType">
            <SelectValue placeholder="Select discount type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Percentage">Percentage (%)</SelectItem>
            <SelectItem value="Fixed Amount">Fixed Amount (₹)</SelectItem>
            <SelectItem value="Free Add-On">Free Add-On</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="discountValue">Discount Value <span className="text-red-500">*</span></Label>
        <div className="flex items-center">
          <Input 
            id="discountValue" 
            type="number"
            min={0}
            value={formData.discountValue || ''}
            onChange={(e) => updateFormData({ ...formData, discountValue: Number(e.target.value) })}
          />
          <div className="ml-2 min-w-[50px] text-center">
            {formData.discountType === 'Percentage' && '%'}
            {formData.discountType === 'Fixed Amount' && '₹'}
            {formData.discountType === 'Free Add-On' && ' items'}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          {formData.discountType === 'Percentage' && 'Enter the percentage discount (e.g., 20 for 20% off)'}
          {formData.discountType === 'Fixed Amount' && 'Enter the amount to discount in ₹ (e.g., 250 for ₹250 off)'}
          {formData.discountType === 'Free Add-On' && 'Enter the number of free add-on items to include'}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="validityType">Validity Type</Label>
        <Select 
          value={formData.validityType} 
          onValueChange={(value) => updateFormData({ ...formData, validityType: value })}
        >
          <SelectTrigger id="validityType">
            <SelectValue placeholder="Select validity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Days">All Days</SelectItem>
            <SelectItem value="Weekend Only">Weekend Only</SelectItem>
            <SelectItem value="Weekday Only">Weekday Only</SelectItem>
            <SelectItem value="First Booking">First Booking Only</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Specify when this offer can be redeemed
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="validFrom">Valid From <span className="text-red-500">*</span></Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="validFrom"
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.validFrom ? (
                  format(new Date(formData.validFrom), 'PPP')
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={new Date(formData.validFrom)}
                onSelect={(date) => date && updateFormData({ ...formData, validFrom: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor="validTo">Valid To <span className="text-red-500">*</span></Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="validTo"
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.validTo ? (
                  format(new Date(formData.validTo), 'PPP')
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={new Date(formData.validTo)}
                onSelect={(date) => date && updateFormData({ ...formData, validTo: date })}
                initialFocus
                fromDate={new Date(formData.validFrom)}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="maxRedemptions">Maximum Redemptions</Label>
          <Input 
            id="maxRedemptions" 
            type="number"
            min={1}
            value={formData.maxRedemptions}
            onChange={(e) => updateFormData({ ...formData, maxRedemptions: Number(e.target.value) })}
          />
          <p className="text-xs text-muted-foreground">
            Total times this offer can be redeemed
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="perGuestLimit">Per Guest Limit</Label>
          <Input 
            id="perGuestLimit" 
            type="number"
            min={1}
            value={formData.perGuestLimit}
            onChange={(e) => updateFormData({ ...formData, perGuestLimit: Number(e.target.value) })}
          />
          <p className="text-xs text-muted-foreground">
            How many times each guest can use this offer
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfferDetailsStep;
