
import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SortableTableHeaderProps {
  column: string;
  label: string;
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc';
  onSort: (column: string) => void;
  className?: string;
}

export function SortableTableHeader({
  column,
  label,
  sortColumn,
  sortDirection,
  onSort,
  className
}: SortableTableHeaderProps) {
  const isActive = sortColumn === column;
  
  return (
    <th
      onClick={() => onSort(column)}
      className={cn("px-4 py-3 text-left cursor-pointer select-none text-xs font-medium text-muted-foreground tracking-wider", 
        isActive ? "text-primary" : "",
        className
      )}
    >
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        <span className="inline-flex flex-col">
          {isActive && sortDirection === 'asc' ? (
            <ChevronUp className="h-4 w-4" />
          ) : isActive && sortDirection === 'desc' ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <span className="h-4 w-4 flex flex-col opacity-0 group-hover:opacity-30">
              <ChevronUp className="h-2 w-4" />
              <ChevronDown className="h-2 w-4" />
            </span>
          )}
        </span>
      </div>
    </th>
  );
}
