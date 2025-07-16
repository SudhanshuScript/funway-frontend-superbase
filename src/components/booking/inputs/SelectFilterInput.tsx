
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSelectOptions } from '../utils/filterTypes';

interface SelectFilterInputProps {
  value: string;
  column: string;
  label: string;
  onChange: (value: string) => void;
}

export function SelectFilterInput({ value, column, label, onChange }: SelectFilterInputProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={`Select ${label}`} />
      </SelectTrigger>
      <SelectContent>
        {getSelectOptions(column).map(option => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
