
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PaymentFiltersProps {
  filters: {
    paymentStatus: string;
    sessionName: string;
    guestCount: string;
    dateRange: string;
    guestType: string;
    checkInStatus: string;
    searchQuery: string;
  };
  setFilters: (filters: any) => void;
  onClose: () => void;
}

export function PaymentFilters({ filters, setFilters, onClose }: PaymentFiltersProps) {
  const updateFilter = (key: string, value: string) => {
    setFilters({
      ...filters,
      [key]: value,
    });
  };

  const handleClearFilters = () => {
    setFilters({
      paymentStatus: "all",
      sessionName: "all",
      guestCount: "all",
      dateRange: "all",
      guestType: "all",
      checkInStatus: "all",
      searchQuery: "",
    });
  };

  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Advanced Filters</h3>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleClearFilters}>
              Clear All
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bookings..."
              className="pl-8"
              value={filters.searchQuery}
              onChange={(e) => updateFilter('searchQuery', e.target.value)}
            />
          </div>

          <Select 
            value={filters.paymentStatus} 
            onValueChange={(value) => updateFilter('paymentStatus', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Payment Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="partial">Partial</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={filters.sessionName} 
            onValueChange={(value) => updateFilter('sessionName', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Session Name" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sessions</SelectItem>
              <SelectItem value="breakfast">Breakfast</SelectItem>
              <SelectItem value="brunch">Brunch</SelectItem>
              <SelectItem value="lunch">Lunch</SelectItem>
              <SelectItem value="dinner">Dinner</SelectItem>
              <SelectItem value="sunset">Sunset Dinner</SelectItem>
              <SelectItem value="special">Special Events</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={filters.guestCount} 
            onValueChange={(value) => updateFilter('guestCount', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Guest Count" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Guests</SelectItem>
              <SelectItem value="1-2">1-2 Guests</SelectItem>
              <SelectItem value="3-5">3-5 Guests</SelectItem>
              <SelectItem value="6+">6+ Guests</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={filters.dateRange} 
            onValueChange={(value) => updateFilter('dateRange', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            value={filters.guestType} 
            onValueChange={(value) => updateFilter('guestType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Guest Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Regular">Regular</SelectItem>
              <SelectItem value="VIP">VIP</SelectItem>
              <SelectItem value="First Timer">First Timer</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            value={filters.checkInStatus} 
            onValueChange={(value) => updateFilter('checkInStatus', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Check-In Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Checked-In">Checked-In</SelectItem>
              <SelectItem value="Awaited">Awaited</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
