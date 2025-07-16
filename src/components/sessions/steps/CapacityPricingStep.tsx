
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface CapacityPricingStepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

const addOnOptions = [
  { id: "basic", label: "Basic (Standard amenities)", price: 0 },
  { id: "premium", label: "Premium (Enhanced experience)", price: 29.99 },
  { id: "couple", label: "Couple Package (Romantic setup)", price: 49.99 },
  { id: "vip", label: "VIP (Exclusive perks & priority seating)", price: 79.99 }
];

export function CapacityPricingStep({ formData, updateFormData }: CapacityPricingStepProps) {
  const handleAddOnChange = (addonId: string) => {
    const currentAddons = [...formData.addOnPackages];
    
    if (currentAddons.includes(addonId)) {
      // Remove the addon
      updateFormData({ 
        addOnPackages: currentAddons.filter(id => id !== addonId) 
      });
    } else {
      // Add the addon
      updateFormData({
        addOnPackages: [...currentAddons, addonId]
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-medium">Capacity & Pricing</h2>
        <p className="text-sm text-muted-foreground">
          Define capacity limits and set pricing for this session
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-base">Guest Capacity</Label>
          <div className="mt-2">
            <div className="flex justify-between mb-2">
              <span className="text-sm">Capacity: {formData.maxCapacity}</span>
              <span className="text-xs text-muted-foreground">Max 50</span>
            </div>
            <Slider
              defaultValue={[formData.maxCapacity]}
              min={1}
              max={50}
              step={1}
              onValueChange={(value) => updateFormData({ maxCapacity: value[0] })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="pricePerPerson">Price Per Person</Label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <Input
              id="pricePerPerson"
              type="number"
              value={formData.pricePerPerson}
              onChange={(e) => updateFormData({ pricePerPerson: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
              className="pl-8"
              min={0}
              step={0.01}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Food Preference Support</Label>
            <RadioGroup
              value={formData.foodPreference || "both"}
              onValueChange={(value) => updateFormData({ foodPreference: value })}
              className="flex flex-col space-y-2 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="both" id="both" />
                <Label htmlFor="both">Both Vegetarian & Non-Vegetarian</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="vegetarian" id="vegetarian" />
                <Label htmlFor="vegetarian">Vegetarian Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="non-vegetarian" id="non-vegetarian" />
                <Label htmlFor="non-vegetarian">Non-Vegetarian Only</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>Add-On Packages</Label>
            <div className="space-y-3 mt-2">
              {addOnOptions.map((addon) => (
                <div
                  key={addon.id}
                  className="flex items-start space-x-3 border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    id={addon.id}
                    checked={formData.addOnPackages.includes(addon.id)}
                    onCheckedChange={() => handleAddOnChange(addon.id)}
                  />
                  <div className="space-y-1 leading-none">
                    <Label
                      htmlFor={addon.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {addon.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {addon.price === 0 
                        ? "Included with base price" 
                        : `+$${addon.price.toFixed(2)} per person`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
