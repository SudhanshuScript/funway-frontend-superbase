
import React from 'react';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SortAsc } from 'lucide-react';

interface SessionFiltersBarProps {
  searchQuery: string;
  sortBy: string;
  filterType: string;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: string) => void;
  setFilterType: (filterType: string) => void;
}

export function SessionFiltersBar({
  searchQuery,
  sortBy,
  filterType,
  setSearchQuery,
  setSortBy,
  setFilterType
}: SessionFiltersBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 mt-2 mb-2">
      <div className="w-full sm:w-64 relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search sessions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9"
        />
      </div>
      
      <div className="w-full sm:w-auto flex gap-2">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="type">Type</SelectItem>
            <SelectItem value="time">Time</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="breakfast">Breakfast</SelectItem>
            <SelectItem value="lunch">Lunch</SelectItem>
            <SelectItem value="dinner">Dinner</SelectItem>
            <SelectItem value="evening snacks">Evening Snacks</SelectItem>
            <SelectItem value="special event">Special Event</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
