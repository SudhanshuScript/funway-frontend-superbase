
import React from 'react';
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { CheckCheck } from "lucide-react";
import { ReminderTemplate, ReminderMethod } from '@/types/bookingTypes';

interface BulkReminderManagerProps {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  selectedTemplateId: string;
  setSelectedTemplateId: (id: string) => void;
  selectedMethod: ReminderMethod;
  setSelectedMethod: (method: ReminderMethod) => void;
  reminderTemplates: ReminderTemplate[];
  activeCarts: number;
  onSendBulkReminders: () => void;
}

export function BulkReminderManager({
  showDialog,
  setShowDialog,
  selectedTemplateId,
  setSelectedTemplateId,
  selectedMethod,
  setSelectedMethod,
  reminderTemplates,
  activeCarts,
  onSendBulkReminders,
}: BulkReminderManagerProps) {
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Bulk Reminders</DialogTitle>
          <DialogDescription>
            Send reminders to all active abandoned carts.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Carts
            </Label>
            <div className="col-span-3">
              <div className="flex items-center">
                <CheckCheck className="h-4 w-4 mr-2 text-green-600" />
                <span>{activeCarts} carts will receive reminders</span>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowDialog(false)}>
            Cancel
          </Button>
          <Button onClick={onSendBulkReminders} disabled={!selectedTemplateId || !selectedMethod}>
            <Send className="mr-2 h-4 w-4" />
            Send Bulk Reminders
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
