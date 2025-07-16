
import React from 'react';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReminderTemplate } from '@/types/bookingTypes';

interface DeleteTemplateDialogProps {
  template: ReminderTemplate | null;
  onCancel: () => void;
  onConfirmDelete: () => Promise<void>;
}

export function DeleteTemplateDialog({ template, onCancel, onConfirmDelete }: DeleteTemplateDialogProps) {
  if (!template) return null;
  
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Delete Template</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this template? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <div className="py-4">
        <p className="font-medium">{template.name}</p>
        <p className="text-sm text-muted-foreground mt-1">
          {template.method === 'email' ? 'Email' : template.method === 'sms' ? 'SMS' : 'WhatsApp'} template
        </p>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onConfirmDelete}>
          Delete Template
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
