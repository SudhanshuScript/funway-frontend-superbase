
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NumberRangeInputProps {
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export function NumberRangeInput({ value, onChange }: NumberRangeInputProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div>
        <Label className="text-xs">Min</Label>
        <Input
          type="number"
          min={0}
          value={value[0]}
          onChange={(e) => {
            const newValue = parseInt(e.target.value) || 0;
            onChange([newValue, value[1]]);
          }}
        />
      </div>
      <div>
        <Label className="text-xs">Max</Label>
        <Input
          type="number"
          min={1}
          value={value[1]}
          onChange={(e) => {
            const newValue = parseInt(e.target.value) || 0;
            onChange([value[0], newValue]);
          }}
        />
      </div>
    </div>
  );
}
