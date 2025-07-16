
import React from 'react';
import { Button } from "@/components/ui/button";

interface BookingManagerPaginationProps {
  filteredCount: number;
  totalCount: number;
}

export function BookingManagerPagination({ filteredCount, totalCount }: BookingManagerPaginationProps) {
  return (
    <div className="flex justify-between items-center mt-6 px-1">
      <div className="text-sm text-muted-foreground">
        Showing {filteredCount} of {totalCount} bookings
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" disabled>Previous</Button>
        <Button variant="outline" size="sm" disabled>Next</Button>
      </div>
    </div>
  );
}
