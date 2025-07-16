
import React from "react";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";

interface SessionTypeSelectorProps {
  form: UseFormReturn<any>;
  onTypeChange: (type: string) => void;
}

export const SessionTypeSelector: React.FC<SessionTypeSelectorProps> = ({ form, onTypeChange }) => {
  return (
    <FormField
      control={form.control}
      name="eventType"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>Session Type</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={(value) => {
                field.onChange(value);
                onTypeChange(value);
              }}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="regular" id="regular" />
                <Label htmlFor="regular">Regular Event</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="special" id="special" />
                <Label htmlFor="special">Special Event</Label>
              </div>
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  );
};
