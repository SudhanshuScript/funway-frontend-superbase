
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CalendarPlus } from "lucide-react";
import { format } from 'date-fns';

interface AddFollowUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string;
  onAddFollowUp: (leadId: string, data: { notes: string, scheduled_for: string }) => Promise<boolean>;
}

export function AddFollowUpDialog({
  open,
  onOpenChange,
  leadId,
  onAddFollowUp
}: AddFollowUpDialogProps) {
  // Set default follow-up date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const [followUpData, setFollowUpData] = useState({
    date: format(tomorrow, 'yyyy-MM-dd'),
    time: '10:00',
    notes: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFollowUpData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const scheduledFor = `${followUpData.date}T${followUpData.time}:00Z`;
    
    const success = await onAddFollowUp(leadId, {
      notes: followUpData.notes,
      scheduled_for: scheduledFor
    });
    
    if (success) {
      // Reset form
      setFollowUpData({
        date: format(tomorrow, 'yyyy-MM-dd'),
        time: '10:00',
        notes: ''
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Follow-Up</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={followUpData.date}
                onChange={handleChange}
                required
                min={format(new Date(), 'yyyy-MM-dd')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={followUpData.time}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes *</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="What is this follow-up for?"
              value={followUpData.notes}
              onChange={handleChange}
              rows={3}
              required
            />
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex items-center gap-1">
              <CalendarPlus className="h-4 w-4" /> Schedule
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
