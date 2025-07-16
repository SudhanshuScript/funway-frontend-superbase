
import React from "react";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookingFormValues } from "../../MultiStepBookingFormTypes";

export interface AddonPackage {
  id: string;
  name: string;
  description: string;
  price: string;
}

interface AddonPackageSelectorProps {
  addonPackages: AddonPackage[];
}

export function AddonPackageSelector({ addonPackages }: AddonPackageSelectorProps) {
  const { control, watch } = useFormContext<BookingFormValues>();
  const addonPackage = watch("addonPackage");
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Enhance Your Experience</h3>
      
      <FormField
        control={control}
        name="addonPackage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Add-on Package (Optional)</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an add-on package" />
                </SelectTrigger>
                <SelectContent className="z-50">
                  {addonPackages.map((addon) => (
                    <SelectItem key={addon.id} value={addon.id}>
                      {addon.name} - {addon.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription>
              Choose an add-on package to enhance your experience
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {addonPackage && addonPackage !== "none" && (
        <div className="p-4 bg-primary/5 rounded-md">
          <h4 className="font-medium mb-1">
            {addonPackages.find(a => a.id === addonPackage)?.name}
          </h4>
          <p className="text-sm mb-2">
            {addonPackages.find(a => a.id === addonPackage)?.description}
          </p>
          <p className="text-sm font-medium">
            {addonPackages.find(a => a.id === addonPackage)?.price}
          </p>
        </div>
      )}
    </div>
  );
}
