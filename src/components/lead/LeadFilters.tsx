
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LeadFilter } from "@/types/leadTypes";
import { leadSourceOptions, leadStatusOptions, leadInterestOptions, mockFranchiseStaff } from "@/hooks/lead/mockLeadData";
import { useUserRole } from "@/providers/UserRoleProvider";

interface LeadFiltersProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: LeadFilter;
  onUpdateFilters: (filters: Partial<LeadFilter>) => void;
}

export function LeadFilters({
  open,
  onOpenChange,
  filters,
  onUpdateFilters
}: LeadFiltersProps) {
  const { currentUser } = useUserRole();
  
  const handleReset = () => {
    onUpdateFilters({
      searchQuery: "",
      source: "all",
      status: "all",
      interest: "all",
      franchise_id: currentUser?.role === "superadmin" ? "all" : currentUser?.franchiseId || "all",
      assigned_to: "all"
    });
    onOpenChange(false);
  };
  
  const handleApply = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Filter Leads</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search by name, email or phone"
              value={filters.searchQuery}
              onChange={(e) => onUpdateFilters({ searchQuery: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="source">Lead Source</Label>
            <Select
              value={filters.source}
              onValueChange={(value) => onUpdateFilters({ source: value as any })}
            >
              <SelectTrigger id="source">
                <SelectValue placeholder="All Sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {leadSourceOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Lead Status</Label>
            <Select
              value={filters.status}
              onValueChange={(value) => onUpdateFilters({ status: value as any })}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {leadStatusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="interest">Interest</Label>
            <Select
              value={filters.interest}
              onValueChange={(value) => onUpdateFilters({ interest: value as any })}
            >
              <SelectTrigger id="interest">
                <SelectValue placeholder="All Interests" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Interests</SelectItem>
                {leadInterestOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {currentUser?.role === "superadmin" && (
            <div className="space-y-2">
              <Label htmlFor="franchise">Franchise</Label>
              <Select
                value={filters.franchise_id}
                onValueChange={(value) => onUpdateFilters({ franchise_id: value })}
              >
                <SelectTrigger id="franchise">
                  <SelectValue placeholder="All Franchises" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Franchises</SelectItem>
                  <SelectItem value="franchise-1">Bangalore Franchise</SelectItem>
                  <SelectItem value="franchise-2">Ooty Franchise</SelectItem>
                  <SelectItem value="franchise-3">Puerto Rico Franchise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="assigned">Assigned To</Label>
            <Select
              value={filters.assigned_to}
              onValueChange={(value) => onUpdateFilters({ assigned_to: value })}
            >
              <SelectTrigger id="assigned">
                <SelectValue placeholder="All Staff" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Staff</SelectItem>
                {mockFranchiseStaff
                  .filter(staff => 
                    currentUser?.role === "superadmin" || 
                    staff.franchise_id === currentUser?.franchiseId
                  )
                  .map((staff) => (
                    <SelectItem key={staff.id} value={staff.id}>{staff.name}</SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
        </div>
        <SheetFooter>
          <div className="flex justify-between w-full">
            <Button variant="outline" onClick={handleReset}>Reset</Button>
            <Button onClick={handleApply}>Apply Filters</Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
