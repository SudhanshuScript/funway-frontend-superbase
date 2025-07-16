
import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format, parse } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { SessionFormData } from '../modal/PublishSessionModal';

interface SessionBasicStepProps {
  formData: SessionFormData;
  onFormChange: (data: Partial<SessionFormData>) => void;
}

// Regular event options
const regularEventOptions = [
  "Breakfast", "Brunch", "Joyride", "Breeze", "Lunch", 
  "Nimbus", "Horizon", "Sundowner", "Twilight", "Eclipse", 
  "Feast", "Zenith", "Dinner", "Aurora"
];

// Special event options
const specialEventOptions = [
  "New Year's Eve Dinner", 
  "Valentine's Day Special", 
  "Christmas Feast",
  "Independence Day Celebration", 
  "Thanksgiving Special", 
  "Anniversary Special",
  "Halloween Spooktacular", 
  "Corporate Event", 
  "Private Party", 
  "Custom Special Event"
];

// Time options in 15-minute increments
const timeOptions = Array.from({ length: 24 * 4 }).map((_, index) => {
  const hour = Math.floor(index / 4);
  const minute = (index % 4) * 15;
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
});

// Duration options
const durationOptions = [
  { label: '30 minutes', value: 30 },
  { label: '45 minutes', value: 45 },
  { label: '60 minutes', value: 60 },
  { label: '90 minutes', value: 90 },
  { label: '120 minutes', value: 120 },
];

export const SessionBasicStep = ({ formData, onFormChange }: SessionBasicStepProps) => {
  const [isCustomSpecialName, setIsCustomSpecialName] = React.useState(
    formData.sessionType === "special" && !specialEventOptions.includes(formData.specialName || '')
  );
  
  useEffect(() => {
    // Auto-fill session name based on type
    if (formData.sessionType === "regular" && formData.regularType) {
      onFormChange({ name: formData.regularType });
    } else if (formData.sessionType === "special" && formData.specialName && !isCustomSpecialName) {
      onFormChange({ name: formData.specialName });
    }
  }, [formData.sessionType, formData.regularType, formData.specialName, isCustomSpecialName, onFormChange]);
  
  const handleSessionTypeChange = (value: "regular" | "special") => {
    onFormChange({ sessionType: value });
  };
  
  const handleRegularTypeChange = (value: string) => {
    onFormChange({ regularType: value, name: value, type: value.toLowerCase() });
  };
  
  const handleSpecialNameChange = (value: string) => {
    if (value === "custom") {
      setIsCustomSpecialName(true);
      return;
    }
    
    setIsCustomSpecialName(false);
    onFormChange({ specialName: value, name: value, type: 'special' });
  };
  
  const handleCustomSpecialNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFormChange({ 
      specialName: e.target.value,
      name: e.target.value,
      type: 'special'
    });
  };
  
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onFormChange({ date: date.toISOString().split('T')[0] });
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-1">Session Information</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Set the basic details for your session
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Session Type</Label>
          <RadioGroup
            value={formData.sessionType}
            onValueChange={(value) => handleSessionTypeChange(value as "regular" | "special")}
            className="flex gap-4"
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
          <div className="space-y-2">
            <Label htmlFor="regularType">Select Regular Event Type</Label>
            <Select
              value={formData.regularType}
              onValueChange={handleRegularTypeChange}
            >
              <SelectTrigger id="regularType">
                <SelectValue placeholder="Choose a session type" />
              </SelectTrigger>
              <SelectContent>
                {regularEventOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="specialType">Special Event Type</Label>
              <Select
                value={isCustomSpecialName ? "custom" : formData.specialName}
                onValueChange={handleSpecialNameChange}
              >
                <SelectTrigger id="specialType">
                  <SelectValue placeholder="Choose a special event type" />
                </SelectTrigger>
                <SelectContent>
                  {specialEventOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                  <SelectItem value="custom">Custom (enter name below)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {isCustomSpecialName && (
              <div className="space-y-2">
                <Label htmlFor="customSpecialName">Custom Event Name</Label>
                <Input
                  id="customSpecialName"
                  value={formData.specialName}
                  onChange={handleCustomSpecialNameChange}
                  placeholder="Enter custom event name"
                />
              </div>
            )}
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="sessionName">Session Name</Label>
          <Input
            id="sessionName"
            value={formData.name}
            onChange={(e) => onFormChange({ name: e.target.value })}
            placeholder="Session name"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Session Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? (
                    format(new Date(formData.date), "MMMM d, yyyy")
                  ) : (
                    "Select date"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.date ? new Date(formData.date) : undefined}
                  onSelect={handleDateSelect}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <Select
              value={formData.startTime}
              onValueChange={(value) => onFormChange({ startTime: value })}
            >
              <SelectTrigger id="startTime">
                <SelectValue placeholder="Select start time" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => (
                  <SelectItem key={time} value={time}>{time}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="duration">Session Duration</Label>
          <Select
            value={String(formData.duration)}
            onValueChange={(value) => onFormChange({ duration: parseInt(value) })}
          >
            <SelectTrigger id="duration">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              {durationOptions.map((option) => (
                <SelectItem key={option.value} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
