
import React from 'react';
import { CalendarX2 } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 bg-muted/20 rounded-md">
      <CalendarX2 className="w-12 h-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">No bookings found</h3>
      <p className="text-muted-foreground">There are no bookings matching your filters.</p>
    </div>
  );
}
