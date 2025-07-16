
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";  // Added missing import
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const regularSessionTypes = [
  "Breakfast", "Brunch", "Joyride", "Breeze", "Lunch", 
  "Nimbus", "Horizon", "Sundowner", "Twilight", "Eclipse", 
  "Feast", "Zenith", "Dinner", "Aurora"
];

const specialSessionTypes = [
  "New Year's Eve Dinner", "Valentine's Day Special", "Christmas Feast",
  "Independence Day Celebration", "Thanksgiving Special", "Anniversary Special",
  "Halloween Spooktacular", "Corporate Event", "Private Party", "Custom Special Event"
];

const timeOptions = Array.from({ length: 24 * 4 }, (_, i) => {
  const hour = Math.floor(i / 4);
  const minute = (i % 4) * 15;
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
});

const durationOptions = [
  { value: "30", label: "30 minutes" },
  { value: "45", label: "45 minutes" },
  { value: "60", label: "60 minutes" },
  { value: "90", label: "90 minutes" },
  { value: "120", label: "120 minutes" },
];

interface SessionInfoStepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export function SessionInfoStep({ formData, updateFormData }: SessionInfoStepProps) {
  const [isCustomSpecialName, setIsCustomSpecialName] = useState(
    formData.sessionType === "special" && !specialSessionTypes.includes(formData.specialName)
  );

  useEffect(() => {
    // Automatically set session name based on type selection
    if (formData.sessionType === "regular" && formData.regularType) {
      updateFormData({ name: formData.regularType });
    } else if (formData.sessionType === "special" && formData.specialName && !isCustomSpecialName) {
      updateFormData({ name: formData.specialName });
    }
  }, [formData.sessionType, formData.regularType, formData.specialName, isCustomSpecialName]);

  const handleCustomSpecialNameChange = (value: string) => {
    if (value === "custom") {
      setIsCustomSpecialName(true);
    } else {
      setIsCustomSpecialName(false);
      updateFormData({ specialName: value, name: value });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-medium">Session Information</h2>
        <p className="text-sm text-muted-foreground">
          Set the basic details for your new session
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Session Type</Label>
          <RadioGroup
            value={formData.sessionType}
            onValueChange={(value) => updateFormData({ sessionType: value })}
            className="flex gap-4 mt-2"
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
        </div>

        {formData.sessionType === "regular" ? (
          <div>
            <Label htmlFor="regularType">Select Session</Label>
            <Select
              value={formData.regularType}
              onValueChange={(value) => updateFormData({ regularType: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Choose a session type" />
              </SelectTrigger>
              <SelectContent>
                {regularSessionTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="specialType">Special Event Type</Label>
              <Select
                value={isCustomSpecialName ? "custom" : formData.specialName}
                onValueChange={handleCustomSpecialNameChange}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose a special event type" />
                </SelectTrigger>
                <SelectContent>
                  {specialSessionTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Custom (enter name below)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {isCustomSpecialName && (
              <div>
                <Label htmlFor="customSpecialName">Custom Event Name</Label>
                <Input
                  id="customSpecialName"
                  value={formData.specialName}
                  onChange={(e) => updateFormData({ 
                    specialName: e.target.value,
                    name: e.target.value
                  })}
                  placeholder="Enter custom event name"
                  className="mt-1"
                />
              </div>
            )}
          </div>
        )}

        <div>
          <Label htmlFor="sessionName">Session Name</Label>
          <Input
            id="sessionName"
            value={formData.name}
            onChange={(e) => updateFormData({ name: e.target.value })}
            placeholder="Session name"
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Session Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "mt-1 w-full justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? (
                    format(formData.date, "PPP")
                  ) : (
                    "Select date"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 pointer-events-auto">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => updateFormData({ date })}
                  initialFocus
                  className="p-3"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="startTime">Start Time</Label>
            <Select
              value={formData.startTime}
              onValueChange={(value) => updateFormData({ startTime: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select start time" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="duration">Session Duration</Label>
          <Select
            value={formData.duration}
            onValueChange={(value) => updateFormData({ duration: value })}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select session duration" />
            </SelectTrigger>
            <SelectContent>
              {durationOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
