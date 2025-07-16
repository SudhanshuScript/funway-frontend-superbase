
import React from 'react';

interface GuestCountCellProps {
  totalGuests: number;
  vegCount?: number;
  nonVegCount?: number;
}

export function GuestCountCell({ 
  totalGuests, 
  vegCount, 
  nonVegCount 
}: GuestCountCellProps) {
  return (
    <>
      <div className="text-sm">
        {totalGuests} {totalGuests === 1 ? "person" : "people"}
      </div>
      {(vegCount !== undefined || nonVegCount !== undefined) && (
        <div className="text-xs text-muted-foreground mt-1">
          {vegCount !== undefined && vegCount > 0 && `${vegCount} veg`}
          {vegCount !== undefined && vegCount > 0 && nonVegCount !== undefined && nonVegCount > 0 && " / "}
          {nonVegCount !== undefined && nonVegCount > 0 && `${nonVegCount} non-veg`}
        </div>
      )}
    </>
  );
}
