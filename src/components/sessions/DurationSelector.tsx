
import React from "react";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

interface DurationSelectorProps {
  form: UseFormReturn<any>;
}

export const DurationSelector: React.FC<DurationSelectorProps> = ({ form }) => {
  const durations = ["30", "45", "60", "90", "120"];
  
  return (
    <FormField
      control={form.control}
      name="duration"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Duration (minutes)</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {durations.map((duration) => (
                <SelectItem key={duration} value={duration}>
                  {duration} minutes
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
};
