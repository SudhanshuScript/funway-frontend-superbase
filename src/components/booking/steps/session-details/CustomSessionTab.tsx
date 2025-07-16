
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { format, isBefore } from "date-fns";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { CalendarIcon, Clock } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { BookingFormValues } from "../../MultiStepBookingFormTypes";
import { SessionType } from "./sessionTypes";

interface CustomSessionTabProps {
  sessionData: Record<string, SessionType>;
  timeSlots: string[];
}

export function CustomSessionTab({ sessionData, timeSlots }: CustomSessionTabProps) {
  const { control, watch, setValue } = useFormContext<BookingFormValues>();
  const [showCustomSession, setShowCustomSession] = useState(false);
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="experienceDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Experience Date *</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Select date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-50" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => isBefore(date, new Date())}
                      initialFocus
                      className="pointer-events-auto bg-popover rounded-md border shadow-md"
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormDescription>
                Choose a date for your FlyDining experience
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="sessionType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Session Type *</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-2 gap-3"
                >
                  {Object.entries(sessionData).map(([key, session]) => {
                    const SessionIcon = session.icon;
                    
                    return (
                      <div key={key} className="relative">
                        <RadioGroupItem
                          value={key}
                          id={`session-${key}`}
                          className="peer sr-only"
                        />
                        <label
                          htmlFor={`session-${key}`}
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                        >
                          <SessionIcon className="mb-2 h-5 w-5" />
                          <div className="text-sm font-medium">{session.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">{session.duration}</div>
                        </label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </FormControl>
              <FormDescription>
                Select a session type for your experience
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={control}
        name="bookingTime"
        render={({ field }) => (
          <FormItem className="mb-4">
            <FormLabel>Time Slot *</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-wrap gap-3"
              >
                {timeSlots.map((time) => (
                  <div key={time} className="relative">
                    <RadioGroupItem
                      value={time}
                      id={`time-${time}`}
                      className="peer sr-only"
                    />
                    <label
                      htmlFor={`time-${time}`}
                      className="flex items-center justify-center rounded-md border-2 border-muted bg-popover px-3 py-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer min-w-[80px]"
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      <span>{time}</span>
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
            <FormDescription>
              Choose a time slot for your selected session
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="flex items-center space-x-2 mb-4">
        <Checkbox 
          id="custom-session" 
          checked={showCustomSession}
          onCheckedChange={(checked) => {
            setShowCustomSession(!!checked);
            if (!checked) {
              setValue("customSessionName", "");
            }
          }}
        />
        <label
          htmlFor="custom-session"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          This is a special occasion (customize session name)
        </label>
      </div>
      
      {showCustomSession && (
        <FormField
          control={control}
          name="customSessionName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custom Session Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Anniversary Dinner, Birthday Celebration" {...field} />
              </FormControl>
              <FormDescription>
                Provide a custom name for this session (optional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
