
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ReminderMethod, AbandonedCart } from "@/types/bookingTypes";
import { Send } from "lucide-react";

interface ReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCart: AbandonedCart | null;
  selectedTemplateId: string;
  setSelectedTemplateId: (id: string) => void;
  selectedMethod: ReminderMethod;
  setSelectedMethod: (method: ReminderMethod) => void;
  reminderTemplates: Array<{
    id: string;
    name: string;
    method: ReminderMethod;
  }>;
  onConfirmSendReminder: () => Promise<void>;
}

export function ReminderDialog({
  open,
  onOpenChange,
  selectedCart,
  selectedTemplateId,
  setSelectedTemplateId,
  selectedMethod,
  setSelectedMethod,
  reminderTemplates,
  onConfirmSendReminder
}: ReminderDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Reminder</DialogTitle>
          <DialogDescription>
            Send a reminder to the guest to complete their booking.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="guest" className="text-right">
              Guest
            </Label>
            <div className="col-span-3">
              <Input id="guest" value={selectedCart?.guestName || ""} readOnly />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="template" className="text-right">
              Template
            </Label>
            <div className="col-span-3">
              <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {reminderTemplates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="method" className="text-right">
              Method
            </Label>
            <div className="col-span-3">
              <Select value={selectedMethod} onValueChange={(value: ReminderMethod) => setSelectedMethod(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirmSendReminder}>
            <Send className="mr-2 h-4 w-4" />
            Send Reminder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
