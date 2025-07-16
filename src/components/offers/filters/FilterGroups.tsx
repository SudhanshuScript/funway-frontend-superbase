
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { OfferFilters } from '@/types/offerTypes';

interface FilterGroupsProps {
  filters: OfferFilters;
  setFilters: React.Dispatch<React.SetStateAction<OfferFilters>>;
}

export const OfferTypeFilter = ({ filters, setFilters }: FilterGroupsProps) => {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Offer Type</h4>
      <Select
        value={filters.type}
        onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select offer type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="Happy Hour">Happy Hour</SelectItem>
          <SelectItem value="Event">Event</SelectItem>
          <SelectItem value="Loyalty">Loyalty</SelectItem>
          <SelectItem value="First-Time">First-Time</SelectItem>
          <SelectItem value="Custom">Custom</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export const StatusFilter = ({ filters, setFilters }: FilterGroupsProps) => {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Status</h4>
      <Select
        value={filters.status}
        onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="Active">Active</SelectItem>
          <SelectItem value="Scheduled">Scheduled</SelectItem>
          <SelectItem value="Draft">Draft</SelectItem>
          <SelectItem value="Expired">Expired</SelectItem>
          <SelectItem value="Pending">Pending Approval</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export const FranchiseFilter = ({ filters, setFilters }: FilterGroupsProps) => {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Franchise</h4>
      <Select
        value={filters.franchiseId}
        onValueChange={(value) => setFilters(prev => ({ ...prev, franchiseId: value }))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select franchise" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Franchises</SelectItem>
          <SelectItem value="franchise-1">FlyDining Central</SelectItem>
          <SelectItem value="franchise-2">FlyDining North</SelectItem>
          <SelectItem value="franchise-3">FlyDining South</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export const GuestSegmentFilter = ({ filters, setFilters }: FilterGroupsProps) => {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Guest Segment</h4>
      <Select
        value={filters.guestSegment}
        onValueChange={(value) => setFilters(prev => ({ ...prev, guestSegment: value }))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select guest segment" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Segments</SelectItem>
          <SelectItem value="VIP">VIP</SelectItem>
          <SelectItem value="Regular">Regular</SelectItem>
          <SelectItem value="New">New</SelectItem>
          <SelectItem value="First-Time">First-Time</SelectItem>
          <SelectItem value="Unregistered">Unregistered</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export const ValidityTypeFilter = ({ filters, setFilters }: FilterGroupsProps) => {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Validity Type</h4>
      <Select
        value={filters.validityType}
        onValueChange={(value) => setFilters(prev => ({ ...prev, validityType: value }))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select validity type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="Weekend Only">Weekend Only</SelectItem>
          <SelectItem value="Weekday Only">Weekday Only</SelectItem>
          <SelectItem value="First Booking">First Booking</SelectItem>
          <SelectItem value="All Days">All Days</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export const DateRangeFilter = ({ filters, setFilters }: FilterGroupsProps) => {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Date Range</h4>
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          className="justify-start text-left font-normal"
          onClick={() => {
            const today = new Date();
            setFilters(prev => ({
              ...prev,
              dateRange: {
                ...prev.dateRange,
                from: today
              }
            }));
          }}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {filters.dateRange.from ? (
            format(filters.dateRange.from, 'PPP')
          ) : (
            <span>From date</span>
          )}
        </Button>
        <Button
          variant="outline"
          className="justify-start text-left font-normal"
          onClick={() => {
            const today = new Date();
            setFilters(prev => ({
              ...prev,
              dateRange: {
                ...prev.dateRange,
                to: today
              }
            }));
          }}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {filters.dateRange.to ? (
            format(filters.dateRange.to, 'PPP')
          ) : (
            <span>To date</span>
          )}
        </Button>
      </div>
    </div>
  );
};
