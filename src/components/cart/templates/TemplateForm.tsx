
import React from 'react';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ReminderMethod, ReminderTemplate } from '@/types/bookingTypes';

interface TemplateFormProps {
  formData: Omit<ReminderTemplate, 'id'>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  onSubmit: () => Promise<void>;
  isEditing: boolean;
}

export function TemplateForm({
  formData,
  onInputChange,
  onSelectChange,
  onCheckboxChange,
  onCancel,
  onSubmit,
  isEditing
}: TemplateFormProps) {
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{isEditing ? 'Edit Template' : 'Create Template'}</DialogTitle>
        <DialogDescription>
          {isEditing 
            ? 'Update the reminder template details' 
            : 'Create a new reminder template for abandoned carts'}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <div className="col-span-3">
            <Input 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={onInputChange} 
              placeholder="Template name"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="method" className="text-right">
            Method
          </Label>
          <div className="col-span-3">
            <Select 
              value={formData.method}
              onValueChange={(value) => onSelectChange('method', value)}
            >
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
        
        {formData.method === 'email' && (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject" className="text-right">
              Subject
            </Label>
            <div className="col-span-3">
              <Input 
                id="subject" 
                name="subject" 
                value={formData.subject || ''} 
                onChange={onInputChange} 
                placeholder="Email subject"
              />
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="body" className="text-right">
            Body
          </Label>
          <div className="col-span-3">
            <Textarea 
              id="body" 
              name="body" 
              value={formData.body} 
              onChange={onInputChange} 
              placeholder="Message body"
              className="min-h-[120px]"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Use placeholders like {'{guestName}'}, {'{sessionName}'}, {'{bookingDate}'}, {'{discountCode}'}, {'{cartLink}'}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="isDefault" className="text-right">
            Default Template
          </Label>
          <div className="col-span-3 flex items-center">
            <Input 
              id="isDefault" 
              name="isDefault" 
              type="checkbox" 
              checked={formData.isDefault} 
              onChange={onCheckboxChange}
              className="h-4 w-4 mr-2"
            />
            <span className="text-sm text-muted-foreground">Set as default for this method</span>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>
          {isEditing ? 'Update Template' : 'Create Template'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
