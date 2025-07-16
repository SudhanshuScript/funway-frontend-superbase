
import React from 'react';
import { Button } from "@/components/ui/button";
import { DateInput } from "@/components/ui/date-input";
import { Filter, ArrowUpDown } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { FilterParams } from "../../hooks/useSessionFilters";

interface AdvancedFiltersPopoverProps {
  filterParams: FilterParams;
  setFilterParams: React.Dispatch<React.SetStateAction<FilterParams>>;
  sessionTypes: string[];
  onResetFilters: () => void;
}

const AdvancedFiltersPopover = ({
  filterParams,
  setFilterParams,
  sessionTypes,
  onResetFilters
}: AdvancedFiltersPopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[340px]">
        <div className="space-y-4">
          <h3 className="font-medium text-sm flex items-center">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Advanced Filters
          </h3>
          
          <div className="space-y-2">
            <p className="text-sm font-medium mb-1">Date Range</p>
            <div className="flex flex-wrap gap-2">
              <DateInput 
                placeholder="From date" 
                value={filterParams.dateRange?.from} 
                onChange={(date) => setFilterParams(prev => ({
                  ...prev,
                  dateRange: { 
                    ...prev.dateRange, 
                    from: date 
                  }
                }))} 
                className="w-full" 
              />
              <DateInput 
                placeholder="To date" 
                value={filterParams.dateRange?.to} 
                onChange={(date) => setFilterParams(prev => ({
                  ...prev,
                  dateRange: { 
                    ...prev.dateRange, 
                    to: date 
                  }
                }))} 
                className="w-full" 
              />
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm font-medium mb-1">Session Type</p>
              <Select 
                value={filterParams.sessionType} 
                onValueChange={(value) => setFilterParams(prev => ({ ...prev, sessionType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="special">Special</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                  {sessionTypes.map(type => (
                    type !== 'all' && <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-1">Status</p>
              <Select 
                value={filterParams.status} 
                onValueChange={(value) => setFilterParams(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-1">Performance</p>
              <Select 
                value={filterParams.performance} 
                onValueChange={(val) => setFilterParams(prev => ({ 
                  ...prev, 
                  performance: val 
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Performance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="high">Top (&gt;80%)</SelectItem>
                  <SelectItem value="medium">Medium (40-80%)</SelectItem>
                  <SelectItem value="low">Low (10-40%)</SelectItem>
                  <SelectItem value="unused">Unused (&lt;10%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-1">Duration</p>
              <Select 
                value={typeof filterParams.duration === 'string' ? filterParams.duration : 'all'} 
                onValueChange={(value) => setFilterParams(prev => ({ ...prev, duration: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="30">30 mins</SelectItem>
                  <SelectItem value="60">60 mins</SelectItem>
                  <SelectItem value="90">90 mins</SelectItem>
                  <SelectItem value="120">120 mins</SelectItem>
                  <SelectItem value="180">180 mins</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button variant="outline" size="sm" className="w-full" onClick={onResetFilters}>
            Reset Filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AdvancedFiltersPopover;
