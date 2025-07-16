
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";

interface EmptyOrLoadingStateProps {
  isLoading: boolean;
  colSpan: number;
}

const EmptyOrLoadingState = ({ isLoading, colSpan }: EmptyOrLoadingStateProps) => {
  if (isLoading) {
    return (
      <TableRow>
        <TableCell colSpan={colSpan} className="h-24 text-center">Loading offers...</TableCell>
      </TableRow>
    );
  }
  
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-24 text-center">No offers found</TableCell>
    </TableRow>
  );
};

export default EmptyOrLoadingState;
