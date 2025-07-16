
import React from "react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FranchiseStatus, InactivityReason } from "@/types/franchiseTypes";

type FilterProps = {
  searchTerm: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onCreateFranchise: () => void;
};

export const franchiseStatusVariants = {
  active: "success",
  inactive: "destructive"
};

export const FranchiseStatusBadge = ({ 
  status, 
  reason 
}: { 
  status: FranchiseStatus; 
  reason?: InactivityReason 
}) => {
  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant={status === 'active' ? 'success' : 'destructive'}
        className="capitalize"
      >
        {status}
      </Badge>
      
      {status === 'inactive' && reason && (
        <span className="text-xs text-muted-foreground">({reason})</span>
      )}
    </div>
  );
};

const FranchiseFilters = ({
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  onCreateFranchise
}: FilterProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
      <div className="flex flex-1 flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search franchises..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select
            value={statusFilter}
            onValueChange={onStatusFilterChange}
          >
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Button className="w-full sm:w-auto" onClick={onCreateFranchise}>
        <Plus className="mr-2 h-4 w-4" /> Add Franchise
      </Button>
    </div>
  );
};

export default FranchiseFilters;
