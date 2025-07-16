
import React from 'react';
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";

interface DateRangeInputProps {
  value: [Date | undefined, Date | undefined];
  onChange: (value: [Date | undefined, Date | undefined]) => void;
}

export function DateRangeInput({ value, onChange }: DateRangeInputProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div>
        <Label className="text-xs">Start Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left">
              {value[0] ? format(value[0], 'PP') : 'Select date'}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 pointer-events-auto z-50">
            <Calendar
              mode="single"
              selected={value[0]}
              onSelect={(date) => onChange([date, value[1]])}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Label className="text-xs">End Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left">
              {value[1] ? format(value[1], 'PP') : 'Select date'}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 pointer-events-auto z-50">
            <Calendar
              mode="single"
              selected={value[1]}
              onSelect={(date) => onChange([value[0], date])}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
