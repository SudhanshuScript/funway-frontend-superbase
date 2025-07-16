
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon, FilterIcon, X, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

export interface FilterOption {
  column: string;
  value: string | string[] | [Date | undefined, Date | undefined] | [number, number] | null;
  type: 'text' | 'date' | 'dateRange' | 'select' | 'numberRange';
  label: string;
}

interface BookingFiltersProps {
  onFilterChange: (filters: FilterOption[]) => void;
  activeFilters: FilterOption[];
}

export function BookingFilters({ onFilterChange, activeFilters }: BookingFiltersProps) {
  const [currentFilter, setCurrentFilter] = useState<FilterOption | null>(null);
  const [tempTextValue, setTempTextValue] = useState('');
  const [tempSelectValue, setTempSelectValue] = useState('');
  const [tempDateRange, setTempDateRange] = useState<[Date | undefined, Date | undefined]>([undefined, undefined]);
  const [tempNumberRange, setTempNumberRange] = useState<[number, number]>([0, 100]);
  const [showFilters, setShowFilters] = useState(false);

  const columnOptions = [
    { value: 'bookingId', label: 'Booking ID', type: 'text' },
    { value: 'customer', label: 'Guest Name', type: 'text' },
    { value: 'date', label: 'Booking Date', type: 'dateRange' },
    { value: 'sessionName', label: 'Session', type: 'select' },
    { value: 'totalGuests', label: 'Guest Count', type: 'numberRange' },
    { value: 'status', label: 'Payment Status', type: 'select' },
    { value: 'checkInStatus', label: 'Check-In Status', type: 'select' },
    { value: 'guestType', label: 'Guest Type', type: 'select' },
  ];

  const getSelectOptions = (column: string) => {
    switch (column) {
      case 'sessionName':
        return [
          { value: 'Breakfast', label: 'Breakfast' },
          { value: 'Brunch', label: 'Brunch' },
          { value: 'Lunch', label: 'Lunch' },
          { value: 'Dinner', label: 'Dinner' },
          { value: 'Sunset Dinner', label: 'Sunset Dinner' },
          { value: 'Special Event', label: 'Special Event' },
        ];
      case 'status':
        return [
          { value: 'Paid', label: 'Paid' },
          { value: 'Pending', label: 'Pending' },
          { value: 'Partial', label: 'Partial' },
          { value: 'Overdue', label: 'Overdue' },
          { value: 'Refunded', label: 'Refunded' },
        ];
      case 'checkInStatus':
        return [
          { value: 'Checked-In', label: 'Checked-In' },
          { value: 'Awaited', label: 'Awaited' },
        ];
      case 'guestType':
        return [
          { value: 'Regular', label: 'Regular' },
          { value: 'VIP', label: 'VIP' },
          { value: 'First Timer', label: 'First Timer' },
        ];
      default:
        return [];
    }
  };

  const handleSelectColumn = (column: string) => {
    const selectedColumnOption = columnOptions.find(opt => opt.value === column);
    if (selectedColumnOption) {
      let initialValue: string | [Date | undefined, Date | undefined] | [number, number] | null = null;
      
      switch (selectedColumnOption.type) {
        case 'text':
          initialValue = '';
          setTempTextValue('');
          break;
        case 'select':
          initialValue = '';
          setTempSelectValue('');
          break;
        case 'dateRange':
          initialValue = [undefined, undefined];
          setTempDateRange([undefined, undefined]);
          break;
        case 'numberRange':
          initialValue = [0, 100];
          setTempNumberRange([0, 100]);
          break;
      }

      setCurrentFilter({
        column,
        value: initialValue,
        type: selectedColumnOption.type as any,
        label: selectedColumnOption.label
      });
    }
  };

  const addFilter = () => {
    if (!currentFilter) return;
    
    // Don't add empty filters
    if (
      (currentFilter.type === 'text' && !currentFilter.value) || 
      (currentFilter.type === 'select' && !tempSelectValue) ||
      (currentFilter.type === 'dateRange' && (!tempDateRange[0] || !tempDateRange[1])) ||
      (currentFilter.type === 'numberRange' && (tempNumberRange[0] === 0 && tempNumberRange[1] === 100))
    ) {
      return;
    }

    let filterValue: any;
    switch (currentFilter.type) {
      case 'select':
        filterValue = tempSelectValue;
        break;
      case 'dateRange':
        filterValue = tempDateRange;
        break;
      case 'numberRange':
        filterValue = tempNumberRange;
        break;
      default:
        filterValue = currentFilter.value;
    }

    const newFilter = {
      ...currentFilter,
      value: filterValue
    };

    // Remove any existing filter on the same column
    const updatedFilters = activeFilters.filter(f => f.column !== newFilter.column);
    const finalFilters = [...updatedFilters, newFilter];
    
    onFilterChange(finalFilters);
    setCurrentFilter(null);
  };

  const removeFilter = (columnToRemove: string) => {
    const updatedFilters = activeFilters.filter(f => f.column !== columnToRemove);
    onFilterChange(updatedFilters);
  };

  const clearAllFilters = () => {
    onFilterChange([]);
  };

  const renderFilterValueInput = () => {
    if (!currentFilter) return null;

    switch (currentFilter.type) {
      case 'text':
        return (
          <Input
            placeholder={`Search ${currentFilter.label.toLowerCase()}`}
            value={tempTextValue}
            onChange={(e) => {
              setTempTextValue(e.target.value);
              setCurrentFilter({ ...currentFilter, value: e.target.value });
            }}
            className="w-full"
          />
        );
      case 'select':
        return (
          <Select value={tempSelectValue} onValueChange={setTempSelectValue}>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${currentFilter.label}`} />
            </SelectTrigger>
            <SelectContent>
              {getSelectOptions(currentFilter.column).map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'dateRange':
        return (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    {tempDateRange[0] ? format(tempDateRange[0], 'PP') : 'Select date'}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 pointer-events-auto">
                  <Calendar
                    mode="single"
                    selected={tempDateRange[0]}
                    onSelect={(date) => setTempDateRange([date, tempDateRange[1]])}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label className="text-xs">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    {tempDateRange[1] ? format(tempDateRange[1], 'PP') : 'Select date'}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 pointer-events-auto">
                  <Calendar
                    mode="single"
                    selected={tempDateRange[1]}
                    onSelect={(date) => setTempDateRange([tempDateRange[0], date])}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        );
      case 'numberRange':
        return (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Min</Label>
              <Input
                type="number"
                min={0}
                value={tempNumberRange[0]}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  setTempNumberRange([value, tempNumberRange[1]]);
                }}
              />
            </div>
            <div>
              <Label className="text-xs">Max</Label>
              <Input
                type="number"
                min={1}
                value={tempNumberRange[1]}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  setTempNumberRange([tempNumberRange[0], value]);
                }}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getFilterDisplayValue = (filter: FilterOption) => {
    switch (filter.type) {
      case 'text':
        return String(filter.value);
      case 'select':
        return String(filter.value);
      case 'dateRange':
        const dateRange = filter.value as [Date | undefined, Date | undefined];
        return `${dateRange[0] ? format(dateRange[0], 'PP') : ''} - ${dateRange[1] ? format(dateRange[1], 'PP') : ''}`;
      case 'numberRange':
        const numRange = filter.value as [number, number];
        return `${numRange[0]} - ${numRange[1]}`;
      default:
        return String(filter.value);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center"
          >
            <FilterIcon className="h-4 w-4 mr-2" />
            Filters
            <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </Button>
          
          <div className="flex flex-wrap gap-1">
            {activeFilters.map((filter, idx) => (
              <Badge key={idx} variant="outline" className="flex items-center gap-1 py-1">
                <span className="font-semibold mr-1">{filter.label}:</span> 
                <span>{getFilterDisplayValue(filter)}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0 ml-1" 
                  onClick={() => removeFilter(filter.column)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
        
        {activeFilters.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={clearAllFilters}
          >
            Clear all
          </Button>
        )}
      </div>
      
      {showFilters && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-xs mb-1 block">Select Filter</Label>
                <Select onValueChange={handleSelectColumn}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select column to filter" />
                  </SelectTrigger>
                  <SelectContent>
                    {columnOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {currentFilter && (
                <>
                  <div>
                    <Label className="text-xs mb-1 block">Filter Value</Label>
                    {renderFilterValueInput()}
                  </div>
                  
                  <div className="flex items-end">
                    <Button onClick={addFilter} className="w-full">
                      Apply Filter
                    </Button>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
