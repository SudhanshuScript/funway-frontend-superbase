
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface BookingManagerFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedGuestType: string | null;
  setSelectedGuestType: (type: string | null) => void;
  selectedSessionType: string | null;
  setSelectedSessionType: (type: string | null) => void;
  handleClearFilters: () => void;
  sessionTypes: string[];
}

export function BookingManagerFilters({
  searchQuery,
  setSearchQuery,
  selectedGuestType,
  setSelectedGuestType,
  selectedSessionType,
  setSelectedSessionType,
  handleClearFilters,
  sessionTypes
}: BookingManagerFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search bookings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 w-[200px]"
        />
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-10">
            <Filter className="h-4 w-4 mr-1" />
            <span>Filter</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Filter by</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="font-normal text-xs text-muted-foreground">Guest Type</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setSelectedGuestType("VIP")}>
            VIP
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSelectedGuestType("Regular")}>
            Regular
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSelectedGuestType("First Timer")}>
            First Timer
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="font-normal text-xs text-muted-foreground">Session Type</DropdownMenuLabel>
          {sessionTypes.map(session => (
            <DropdownMenuItem key={session} onClick={() => setSelectedSessionType(session)}>
              {session}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleClearFilters}>
            Clear Filters
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
