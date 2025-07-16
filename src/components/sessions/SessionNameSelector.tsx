
import React from "react";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

// Regular session options
const regularSessionOptions = [
  "Breakfast", "Brunch", "Joyride", "Breeze", "Lunch", 
  "Nimbus", "Horizon", "Sundowner", "Twilight", "Eclipse", 
  "Feast", "Zenith", "Dinner", "Aurora", "Add Custom Name"
];

// Special event options
const specialEventOptions = [
  "New Year's Eve Dinner", "Valentine's Day Special", 
  "Easter Brunch", "Christmas Dinner", "Halloween Special",
  "Thanksgiving Feast", "Anniversary Special", "Birthday Celebration",
  "Graduation Party", "Corporate Event", "Add Custom Name"
];

interface SessionNameSelectorProps {
  form: UseFormReturn<any>;
  sessionType: string;
}

export const SessionNameSelector: React.FC<SessionNameSelectorProps> = ({ form, sessionType }) => {
  const showCustomInput = form.watch("name") === "Add Custom Name";
  const options = sessionType === "special" ? specialEventOptions : regularSessionOptions;
  
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Session Name</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a session name" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
      
      {showCustomInput && (
        <FormField
          control={form.control}
          name="customName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custom Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter custom session name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      )}
    </div>
  );
};
