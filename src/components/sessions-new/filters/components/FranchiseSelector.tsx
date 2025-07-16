
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Franchise } from "@/hooks/useFranchiseSelector";

interface FranchiseSelectorProps {
  selectedFranchiseId: string | 'all';
  onFranchiseChange: (id: string) => void;
  franchiseOptions: Franchise[];
  className?: string;
}

const FranchiseSelector = ({ 
  selectedFranchiseId, 
  onFranchiseChange, 
  franchiseOptions,
  className
}: FranchiseSelectorProps) => {
  return (
    <Select 
      value={selectedFranchiseId} 
      onValueChange={onFranchiseChange}
    >
      <SelectTrigger className={`w-[180px] ${className || ''}`}>
        <SelectValue placeholder="Select franchise" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Franchises</SelectItem>
        {franchiseOptions.map(franchise => (
          <SelectItem key={franchise.id} value={franchise.id}>{franchise.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FranchiseSelector;
