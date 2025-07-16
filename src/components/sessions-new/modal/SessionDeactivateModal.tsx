
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Session } from '@/types';
import { AlertTriangle, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface SessionDeactivateModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session;
  onDeactivate: (sessionId: string, reason: string, comments?: string) => Promise<boolean>;
}

export function SessionDeactivateModal({
  isOpen,
  onClose,
  session,
  onDeactivate,
}: SessionDeactivateModalProps) {
  const [reason, setReason] = useState<string>('');
  const [comments, setComments] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleDeactivate = async () => {
    if (!reason) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await onDeactivate(session.id, reason, comments);
      
      if (result) {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Deactivate Session
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center p-4 rounded-lg bg-muted">
            <Calendar className="h-10 w-10 mr-4 text-primary" />
            <div>
              <h3 className="font-medium">{session.name}</h3>
              <p className="text-sm text-muted-foreground">
                {format(parseISO(session.date), 'MMMM d, yyyy')} at {session.startTime}
              </p>
              <p className="text-sm text-muted-foreground">
                {session.bookedCount || 0} bookings / {session.maxCapacity} capacity
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Deactivation <span className="text-destructive">*</span></Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger id="reason">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cancelled">Session Cancelled</SelectItem>
                <SelectItem value="rescheduled">Session Rescheduled</SelectItem>
                <SelectItem value="maintenance">Maintenance or Technical Issues</SelectItem>
                <SelectItem value="weather">Weather Conditions</SelectItem>
                <SelectItem value="staff">Staffing Issues</SelectItem>
                <SelectItem value="duplicate">Duplicate Session</SelectItem>
                <SelectItem value="other">Other (Please Specify)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="comments">Additional Comments</Label>
            <Textarea 
              id="comments"
              placeholder="Please provide any additional details about this deactivation..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
            />
          </div>
          
          {session.bookedCount > 0 && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-md text-sm">
              <strong>Warning:</strong> This session has {session.bookedCount} existing bookings.
              Deactivating will require guest notification and possible rebooking.
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDeactivate} 
            disabled={!reason || isSubmitting}
          >
            {isSubmitting ? 'Deactivating...' : 'Deactivate Session'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
