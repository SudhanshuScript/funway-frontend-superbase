
import React from 'react';
import { Input } from "@/components/ui/input";

interface TextFilterInputProps {
  value: string;
  label: string;
  onChange: (value: string) => void;
}

export function TextFilterInput({ value, label, onChange }: TextFilterInputProps) {
  return (
    <Input
      placeholder={`Search ${label.toLowerCase()}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full"
    />
  );
}
