
import React from 'react';
import { TableHead } from "@/components/ui/table";

interface Column {
  id: string;
  name: string;
  visible: boolean;
  order: number;
}

interface TableHeaderProps {
  column: Column;
  handleDragStart: (column: Column) => void;
  handleDragOver: (e: React.DragEvent, column: Column) => void;
  handleDragEnd: () => void;
}

export function TableHeaderCell({
  column,
  handleDragStart,
  handleDragOver,
  handleDragEnd
}: TableHeaderProps) {
  return (
    <TableHead 
      key={column.id}
      draggable={column.id !== "actions"}
      onDragStart={() => handleDragStart(column)}
      onDragOver={(e) => handleDragOver(e, column)}
      onDragEnd={handleDragEnd}
      className={`${column.id === "actions" ? "sticky right-0 bg-background/90 dark:bg-background/40 shadow-sm z-10" : "cursor-move"}`}
    >
      <div className="flex items-center gap-1">
        <span className="drag-handle">≡</span>
        {column.name}
      </div>
    </TableHead>
  );
}
