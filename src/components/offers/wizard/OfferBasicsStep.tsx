
import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { OfferFormData, OfferType } from '@/types/offerTypes';

interface OfferBasicsStepProps {
  formData: OfferFormData;
  updateFormData: (data: OfferFormData) => void;
}

const OfferBasicsStep = ({ formData, updateFormData }: OfferBasicsStepProps) => {
  const generateRandomCode = () => {
    const prefix = formData.type === 'Custom' ? 'OFFER' : 
                  formData.type === 'Happy Hour' ? 'HAPPY' : 
                  formData.type === 'Event' ? 'EVENT' :
                  formData.type === 'Loyalty' ? 'LOYAL' : 
                  formData.type === 'First-Time' ? 'FIRST' : 'PROMO';
    
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${randomNum}`;
  };

  const generateOfferCode = () => {
    if (!formData.name) return '';
    
    // Create code based on offer name
    const nameParts = formData.name.trim().split(' ');
    if (nameParts.length >= 2) {
      // Take first letter of each word and add random number
      const prefix = nameParts.slice(0, 2).map(word => word[0].toUpperCase()).join('');
      const randomNum = Math.floor(Math.random() * 100).toString().padStart(2, '0');
      return `${prefix}${randomNum}`;
    } else {
      // If single word, take first 3 letters and add random number
      const prefix = formData.name.substring(0, 3).toUpperCase();
      const randomNum = Math.floor(Math.random() * 100).toString().padStart(2, '0');
      return `${prefix}${randomNum}`;
    }
  };

  useEffect(() => {
    // Auto-generate code when name changes if code is empty
    if (formData.name && !formData.code) {
      updateFormData({
        ...formData,
        code: generateOfferCode()
      });
    }
  }, [formData.name]);

  const handleTypeChange = (type: OfferType) => {
    updateFormData({
      ...formData,
      type,
      // Generate new code when type changes
      code: type !== formData.type ? generateRandomCode() : formData.code
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Offer Name <span className="text-red-500">*</span></Label>
        <Input 
          id="name" 
          placeholder="Weekend Special"
          value={formData.name}
          onChange={(e) => updateFormData({ ...formData, name: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">
          Choose a descriptive name that highlights the value of this offer
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Offer Type</Label>
        <Select 
          value={formData.type} 
          onValueChange={(value) => handleTypeChange(value as OfferType)}
        >
          <SelectTrigger id="type">
            <SelectValue placeholder="Select offer type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Happy Hour">Happy Hour</SelectItem>
            <SelectItem value="Event">Event</SelectItem>
            <SelectItem value="Loyalty">Loyalty</SelectItem>
            <SelectItem value="First-Time">First-Time</SelectItem>
            <SelectItem value="Custom">Custom</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          The category that best describes this offer
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="code">Offer Code <span className="text-red-500">*</span></Label>
        <div className="flex gap-2">
          <Input 
            id="code" 
            placeholder="WEEKEND20"
            value={formData.code}
            onChange={(e) => updateFormData({ ...formData, code: e.target.value.toUpperCase() })}
            className="font-mono uppercase"
          />
          <button
            type="button"
            onClick={() => updateFormData({ ...formData, code: generateRandomCode() })}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-3 rounded text-sm"
          >
            Generate
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          A unique code that customers will enter to redeem this offer
        </p>
      </div>

      <div className="rounded-md bg-blue-50 p-4 mt-6">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Offer ID Assignment</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                An Offer ID will be automatically assigned upon creation. 
                This unique identifier will help track offer statistics and redemptions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferBasicsStep;
