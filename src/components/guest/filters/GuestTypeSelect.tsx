
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GuestTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const GuestTypeSelect: React.FC<GuestTypeSelectProps> = ({ value, onChange }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full sm:w-40">
        <SelectValue placeholder="Guest Type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Types</SelectItem>
        <SelectItem value="VIP">VIP</SelectItem>
        <SelectItem value="Regular">Regular</SelectItem>
        <SelectItem value="New">New</SelectItem>
        <SelectItem value="Inactive">Inactive</SelectItem>
        <SelectItem value="High Potential">High Potential</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default GuestTypeSelect;
