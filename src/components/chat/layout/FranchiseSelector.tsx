
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FranchiseSelectorProps {
  franchiseId: string;
  onFranchiseChange: (franchiseId: string) => void;
  franchises: { id: string; name: string }[];
}

export function FranchiseSelector({
  franchiseId,
  onFranchiseChange,
  franchises
}: FranchiseSelectorProps) {
  return (
    <div className="p-3 border-b">
      <Select 
        value={franchiseId} 
        onValueChange={onFranchiseChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="All Locations" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Locations</SelectItem>
          {franchises.map(franchise => (
            <SelectItem key={franchise.id} value={franchise.id}>
              {franchise.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
