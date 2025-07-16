
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, CalendarRange, X } from 'lucide-react';
import { FilterParams } from '../hooks/useSessionFilters';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRange } from 'react-day-picker';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface SessionFiltersProps {
  filterParams: FilterParams;
  setFilterParams: (params: FilterParams) => void;
  activeTab: 'active' | 'inactive' | 'all';
  setActiveTab: (tab: 'active' | 'inactive' | 'all') => void;
}

const SessionFilters = ({
  filterParams,
  setFilterParams,
  activeTab,
  setActiveTab
}: SessionFiltersProps) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterParams({
      ...filterParams,
      searchQuery: e.target.value,
      search: e.target.value // Update both for compatibility
    });
  };
  
  const handleSessionTypeChange = (value: string) => {
    setFilterParams({
      ...filterParams,
      sessionType: value
    });
  };
  
  const handleDateRangeChange = (range: DateRange | undefined) => {
    setFilterParams({
      ...filterParams,
      dateRange: {
        from: range?.from,
        to: range?.to
      }
    });
  };
  
  const handleStatusChange = (value: string) => {
    setFilterParams({
      ...filterParams,
      status: value
    });
  };
  
  const clearFilters = () => {
    setFilterParams({
      ...filterParams,
      searchQuery: '',
      search: '',
      dateRange: {
        from: undefined,
        to: undefined
      },
      sessionType: 'all',
      staffAssigned: [],
      status: 'all',
      duration: 'all'
    });
  };
  
  const hasActiveFilters = (filterParams.searchQuery !== '' || filterParams.search !== '') || 
    (filterParams.dateRange?.from !== undefined) || 
    filterParams.sessionType !== 'all' || 
    (filterParams.staffAssigned && filterParams.staffAssigned.length > 0) || 
    filterParams.status !== 'all';
  
  return (
    <div className="w-full space-y-4">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'active' | 'inactive' | 'all')}>
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
        <div className="relative w-full sm:w-auto sm:flex-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search sessions..." 
            className="pl-8" 
            value={filterParams.searchQuery || filterParams.search || ''}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                    <span className="text-xs">!</span>
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Filter Sessions</h4>
                
                <div className="space-y-2">
                  <label htmlFor="session-type" className="text-sm font-medium">
                    Session Type
                  </label>
                  <Select
                    value={filterParams.sessionType}
                    onValueChange={handleSessionTypeChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="regular">Regular</SelectItem>
                      <SelectItem value="special">Special</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="status" className="text-sm font-medium">
                    Status
                  </label>
                  <Select
                    value={filterParams.status || 'all'}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Date Range
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarRange className="mr-2 h-4 w-4" />
                        {filterParams.dateRange?.from ? (
                          filterParams.dateRange.to ? (
                            <>
                              {format(filterParams.dateRange.from, "LLL dd, y")} -{" "}
                              {format(filterParams.dateRange.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(filterParams.dateRange.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Select date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-auto p-0">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={filterParams.dateRange?.from}
                        selected={{
                          from: filterParams.dateRange?.from,
                          to: filterParams.dateRange?.to
                        }}
                        onSelect={handleDateRangeChange}
                        numberOfMonths={2}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                {/* Staff assigned would be implemented here */}
                
                <div className="flex justify-between pt-2">
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    <X className="mr-1 h-4 w-4" />
                    Clear Filters
                  </Button>
                  <Button size="sm">Apply Filters</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          {hasActiveFilters && (
            <Button variant="ghost" size="icon" onClick={clearFilters}>
              <X className="h-4 w-4" />
              <span className="sr-only">Clear filters</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionFilters;
