
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FranchiseSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const FranchiseSelect: React.FC<FranchiseSelectProps> = ({ value, onChange }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full sm:w-44">
        <SelectValue placeholder="Select Franchise" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Franchises</SelectItem>
        <SelectItem value="franchise-1">Downtown FlyDining</SelectItem>
        <SelectItem value="franchise-2">Riverside Experience</SelectItem>
        <SelectItem value="franchise-3">Mountain View</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default FranchiseSelect;
