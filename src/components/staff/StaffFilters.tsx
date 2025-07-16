
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EnhancedFranchise } from "@/types/staffTypes";

interface StaffFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedFranchise: string;
  setSelectedFranchise: (id: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (department: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  telegramFilter: string;
  setTelegramFilter: (filter: string) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  sortDirection: "asc" | "desc";
  toggleSortDirection: () => void;
  canManageAllFranchises: boolean;
  franchises: EnhancedFranchise[];
}

const StaffFilters: React.FC<StaffFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedFranchise,
  setSelectedFranchise,
  selectedDepartment,
  setSelectedDepartment,
  selectedStatus,
  setSelectedStatus,
  telegramFilter,
  setTelegramFilter,
  sortBy,
  setSortBy,
  sortDirection,
  toggleSortDirection,
  canManageAllFranchises,
  franchises,
}) => {
  const renderSortIcon = () => {
    return sortDirection === "asc" ? "↑" : "↓";
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case "name": return `Name ${renderSortIcon()}`;
      case "date": return `Date Added ${renderSortIcon()}`;
      case "role": return `Role ${renderSortIcon()}`;
      case "franchise": return `Franchise ${renderSortIcon()}`;
      default: return `Sort ${renderSortIcon()}`;
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search staff by name, email or role..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        {canManageAllFranchises && (
          <Select value={selectedFranchise} onValueChange={setSelectedFranchise}>
            <SelectTrigger className="w-[160px] text-sm">
              <SelectValue placeholder="All Franchises" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Franchises</SelectItem>
              {franchises.map((franchise) => (
                <SelectItem key={franchise.id} value={franchise.id}>
                  {franchise.company_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        
        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
          <SelectTrigger className="w-[140px] text-sm">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="Dining">Dining</SelectItem>
            <SelectItem value="Kitchen">Kitchen</SelectItem>
            <SelectItem value="Hospitality">Hospitality</SelectItem>
            <SelectItem value="Security">Security</SelectItem>
            <SelectItem value="Management">Management</SelectItem>
            <SelectItem value="Marketing">Marketing</SelectItem>
            <SelectItem value="Entertainment">Entertainment</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[120px] text-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="on_leave">On Leave</SelectItem>
            <SelectItem value="training">Training</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={telegramFilter} onValueChange={setTelegramFilter}>
          <SelectTrigger className="w-[160px] text-sm">
            <SelectValue placeholder="Telegram Access" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Telegram</SelectItem>
            <SelectItem value="yes">Telegram Enabled</SelectItem>
            <SelectItem value="no">Telegram Disabled</SelectItem>
          </SelectContent>
        </Select>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              {getSortLabel()}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => { setSortBy("name"); toggleSortDirection(); }}>
              Sort by Name
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setSortBy("date"); toggleSortDirection(); }}>
              Sort by Date Added
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setSortBy("role"); toggleSortDirection(); }}>
              Sort by Role
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setSortBy("franchise"); toggleSortDirection(); }}>
              Sort by Franchise
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default StaffFilters;
