
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Filter, 
  X, 
  Calendar as CalendarIcon, 
  PlusCircle, 
  MapPin,
  SlidersHorizontal 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FranchiseFiltersState, FRANCHISE_STATUS_OPTIONS } from "@/types/franchiseManagement";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LocationSelector from "./LocationSelector";
import { UserRole } from "@/types/navigation";

interface FranchiseFiltersProps {
  filters: FranchiseFiltersState;
  setFilters: React.Dispatch<React.SetStateAction<FranchiseFiltersState>>;
  userRole: UserRole;
  onCreateFranchise?: () => void;
}

const FranchiseFilters: React.FC<FranchiseFiltersProps> = ({
  filters,
  setFilters,
  userRole,
  onCreateFranchise
}) => {
  const [showLocationFilter, setShowLocationFilter] = useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  const handleStatusFilter = (value: string) => {
    setFilters(prev => ({ ...prev, status: value }));
  };

  const handleLocationFilter = (field: 'country' | 'state' | 'city', value: string | null) => {
    setFilters(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }));
  };

  const handleDateRangeFilter = (field: 'from' | 'to', value: Date | null) => {
    setFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [field]: value
      }
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "active",
      dateRange: { from: null, to: null },
      location: { country: null, state: null, city: null }
    });
    setShowLocationFilter(false);
    setShowDateFilter(false);
  };

  const hasActiveFilters = 
    filters.search !== "" || 
    filters.status !== "all" ||
    filters.dateRange.from !== null ||
    filters.dateRange.to !== null ||
    filters.location.country !== null ||
    filters.location.state !== null ||
    filters.location.city !== null;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-1 flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, city, owner..."
              className="pl-8"
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {filters.search && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute right-0 top-0 h-full"
                onClick={() => handleSearch("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select
              value={filters.status}
              onValueChange={handleStatusFilter}
            >
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {FRANCHISE_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <span>More Filters</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[220px]">
              <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setShowLocationFilter(!showLocationFilter)}>
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>Location Filter</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowDateFilter(!showDateFilter)}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>Date Range</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                className={!hasActiveFilters ? "opacity-50 cursor-not-allowed" : ""}
              >
                <X className="mr-2 h-4 w-4" />
                <span>Clear All Filters</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {onCreateFranchise && userRole === "superadmin" && (
            <Button onClick={onCreateFranchise}>
              <PlusCircle className="mr-2 h-4 w-4" /> 
              Add Franchise
            </Button>
          )}
        </div>
      </div>
      
      {showLocationFilter && (
        <div className="p-4 border rounded-lg bg-muted/40">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location Filter
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowLocationFilter(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <LocationSelector 
            countryValue={filters.location.country || ""}
            stateValue={filters.location.state || ""}
            cityValue={filters.location.city || ""}
            onCountryChange={(value) => handleLocationFilter('country', value)}
            onStateChange={(value) => handleLocationFilter('state', value)}
            onCityChange={(value) => handleLocationFilter('city', value)}
          />
        </div>
      )}
      
      {showDateFilter && (
        <div className="p-4 border rounded-lg bg-muted/40">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Date Range Filter
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowDateFilter(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium">Start Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.dateRange.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange.from ? (
                      format(filters.dateRange.from, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange.from || undefined}
                    onSelect={(date) => handleDateRangeFilter('from', date)}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium">End Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.dateRange.to && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange.to ? (
                      format(filters.dateRange.to, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange.to || undefined}
                    onSelect={(date) => handleDateRangeFilter('to', date)}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                    disabled={(date) => 
                      filters.dateRange.from ? date < filters.dateRange.from : false
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      )}
      
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="outline" className="flex items-center gap-1">
              Search: {filters.search}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => handleSearch("")}
              />
            </Badge>
          )}
          
          {filters.status !== "all" && (
            <Badge variant="outline" className="flex items-center gap-1">
              Status: {filters.status}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => handleStatusFilter("all")}
              />
            </Badge>
          )}
          
          {filters.location.country && (
            <Badge variant="outline" className="flex items-center gap-1">
              Country: {filters.location.country}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => handleLocationFilter('country', null)}
              />
            </Badge>
          )}
          
          {filters.location.state && (
            <Badge variant="outline" className="flex items-center gap-1">
              State: {filters.location.state}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => handleLocationFilter('state', null)}
              />
            </Badge>
          )}
          
          {filters.location.city && (
            <Badge variant="outline" className="flex items-center gap-1">
              City: {filters.location.city}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => handleLocationFilter('city', null)}
              />
            </Badge>
          )}
          
          {(filters.dateRange.from || filters.dateRange.to) && (
            <Badge variant="outline" className="flex items-center gap-1">
              Date Range: {filters.dateRange.from ? format(filters.dateRange.from, "PP") : "Any"} 
              {" to "} 
              {filters.dateRange.to ? format(filters.dateRange.to, "PP") : "Any"}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => {
                  handleDateRangeFilter('from', null);
                  handleDateRangeFilter('to', null);
                }}
              />
            </Badge>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="text-xs h-6"
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
};

export default FranchiseFilters;
