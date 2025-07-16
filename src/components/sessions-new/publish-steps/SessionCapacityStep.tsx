
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { SessionFormData } from '../modal/PublishSessionModal';

interface SessionCapacityStepProps {
  formData: SessionFormData;
  onFormChange: (data: Partial<SessionFormData>) => void;
}

export const SessionCapacityStep = ({ formData, onFormChange }: SessionCapacityStepProps) => {
  const handleCapacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      onFormChange({ maxCapacity: value });
    }
  };
  
  const handleSliderChange = (values: number[]) => {
    onFormChange({ maxCapacity: values[0] });
  };
  
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      onFormChange({ pricePerPerson: value });
    }
  };
  
  const calculateRevenue = () => {
    return (formData.pricePerPerson * formData.maxCapacity).toFixed(2);
  };
  
  // Add-on package options
  const addonOptions = [
    { id: 'basic', label: 'Basic Package', description: 'Standard dining experience' },
    { id: 'prime', label: 'Prime Package', description: 'Premium dining with wine pairing' },
    { id: 'couple', label: 'Couple Package', description: 'Romantic setup for two with champagne' },
  ];
  
  const handleAddonToggle = (addonId: string, checked: boolean) => {
    const currentAddons = [...formData.addOnPackages];
    
    if (checked) {
      if (!currentAddons.includes(addonId)) {
        onFormChange({ addOnPackages: [...currentAddons, addonId] });
      }
    } else {
      onFormChange({ 
        addOnPackages: currentAddons.filter(id => id !== addonId) 
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-1">Capacity & Pricing</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Set guest capacity and pricing details
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="capacity">Guest Capacity</Label>
              <span className="text-sm text-muted-foreground">{formData.maxCapacity} guests</span>
            </div>
            <div className="flex items-center gap-4">
              <Slider
                value={[formData.maxCapacity]}
                max={50}
                min={1}
                step={1}
                onValueChange={handleSliderChange}
                className="flex-grow"
              />
              <Input
                id="capacity"
                type="number"
                value={formData.maxCapacity}
                onChange={handleCapacityChange}
                className="w-20"
                min={1}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Maximum number of guests that can attend this session
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Price Per Person ($)</Label>
            <Input
              id="price"
              type="number"
              value={formData.pricePerPerson}
              onChange={handlePriceChange}
              step={0.01}
              min={0}
            />
            <p className="text-xs text-muted-foreground">
              Standard price per guest for this session
            </p>
          </div>
          
          <div className="pt-4 border-t">
            <div className="text-lg font-medium">Revenue Potential</div>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex-grow bg-muted p-4 rounded-md">
                <div className="text-sm text-muted-foreground">Total Revenue</div>
                <div className="text-2xl font-bold">${calculateRevenue()}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Based on {formData.maxCapacity} guests at ${formData.pricePerPerson.toFixed(2)} each
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label>Add-on Packages</Label>
            <p className="text-sm text-muted-foreground mb-4">
              Select additional packages available for this session
            </p>
          </div>
          
          <div className="space-y-4">
            {addonOptions.map((addon) => (
              <div key={addon.id} className="flex gap-2 items-start">
                <Checkbox 
                  id={addon.id} 
                  checked={formData.addOnPackages.includes(addon.id)}
                  onCheckedChange={(checked) => handleAddonToggle(addon.id, checked === true)}
                  className="mt-1"
                />
                <div className="space-y-1">
                  <Label 
                    htmlFor={addon.id} 
                    className="cursor-pointer font-medium"
                  >
                    {addon.label}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {addon.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-muted p-4 rounded-md mt-4">
            <h3 className="text-sm font-medium">Pricing Strategy</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Consider offering special rates for early bookings or large groups to maximize session utilization.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
