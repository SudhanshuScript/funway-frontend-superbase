
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface FilterControlsProps {
  onReset: () => void;
  onApply: () => void;
}

const FilterControls = ({ onReset, onApply }: FilterControlsProps) => {
  return (
    <>
      <Separator />
      <div className="flex justify-between">
        <Button variant="outline" size="sm" onClick={onReset}>
          Reset Filters
        </Button>
        <Button size="sm" onClick={onApply}>
          Apply Filters
        </Button>
      </div>
    </>
  );
};

export default FilterControls;
