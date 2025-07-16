
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lead } from "@/types/leadTypes";
import { Check, Calendar, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

interface ConvertToBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead;
  onConvert: (leadId: string, bookingId: string) => Promise<boolean>;
}

export function ConvertToBookingDialog({
  open,
  onOpenChange,
  lead,
  onConvert
}: ConvertToBookingDialogProps) {
  const [bookingData, setBookingData] = useState({
    sessionDate: format(new Date(), 'yyyy-MM-dd'),
    sessionTime: '19:00',
    guestCount: 2,
    specialRequests: lead.notes || '',
    createGuestProfile: true,
    sendWelcome: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (field: string) => (checked: boolean) => {
    setBookingData(prev => ({ ...prev, [field]: checked }));
  };

  const handleSelectChange = (field: string) => (value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Generate a mock booking ID
    const bookingId = `booking-${Math.floor(Math.random() * 10000)}`;
    const result = await onConvert(lead.id, bookingId);
    if (result) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Convert Lead to Booking</DialogTitle>
          <DialogDescription>
            Complete the booking details to convert {lead.name} from a lead to a guest.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Lead Information</AlertTitle>
            <AlertDescription>
              <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                <div>
                  <span className="font-medium">Name:</span> {lead.name}
                </div>
                <div>
                  <span className="font-medium">Contact:</span> {lead.phone || lead.email}
                </div>
                <div>
                  <span className="font-medium">Interest:</span> {lead.interest?.replace('_', ' ')}
                </div>
                <div>
                  <span className="font-medium">Source:</span> {lead.source}
                </div>
              </div>
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="sessionDate">Session Date</Label>
            <Input
              id="sessionDate"
              name="sessionDate"
              type="date"
              value={bookingData.sessionDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sessionTime">Session Time</Label>
            <Select
              value={bookingData.sessionTime}
              onValueChange={handleSelectChange("sessionTime")}
            >
              <SelectTrigger id="sessionTime">
                <SelectValue placeholder="Select Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="17:00">5:00 PM</SelectItem>
                <SelectItem value="19:00">7:00 PM</SelectItem>
                <SelectItem value="21:00">9:00 PM</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="guestCount">Number of Guests</Label>
            <Input
              id="guestCount"
              name="guestCount"
              type="number"
              min={1}
              max={12}
              value={bookingData.guestCount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialRequests">Special Requests</Label>
            <Textarea
              id="specialRequests"
              name="specialRequests"
              placeholder="Any special requests or notes"
              value={bookingData.specialRequests}
              onChange={handleChange}
              rows={2}
            />
          </div>
          
          <div className="space-y-4 pt-2">
            <Label>Guest Profile Options</Label>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="createGuestProfile" 
                checked={bookingData.createGuestProfile}
                onCheckedChange={handleCheckboxChange('createGuestProfile')}
              />
              <label
                htmlFor="createGuestProfile"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Create guest profile with loyalty points
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="sendWelcome" 
                checked={bookingData.sendWelcome}
                onCheckedChange={handleCheckboxChange('sendWelcome')}
              />
              <label
                htmlFor="sendWelcome"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Send welcome message after conversion
              </label>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <Check className="h-4 w-4" /> Convert & Book
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
