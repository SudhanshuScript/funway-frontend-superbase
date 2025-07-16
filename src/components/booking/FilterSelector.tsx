
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TextFilterInput } from './inputs/TextFilterInput';
import { SelectFilterInput } from './inputs/SelectFilterInput';
import { DateRangeInput } from './inputs/DateRangeInput';
import { NumberRangeInput } from './inputs/NumberRangeInput';
import { FilterOption, columnOptions } from './utils/filterTypes';

interface FilterSelectorProps {
  currentFilter: FilterOption | null;
  setCurrentFilter: (filter: FilterOption | null) => void;
  tempTextValue: string;
  setTempTextValue: (value: string) => void;
  tempSelectValue: string;
  setTempSelectValue: (value: string) => void;
  tempDateRange: [Date | undefined, Date | undefined];
  setTempDateRange: (value: [Date | undefined, Date | undefined]) => void;
  tempNumberRange: [number, number];
  setTempNumberRange: (value: [number, number]) => void;
  addFilter: () => void;
}

export function FilterSelector({
  currentFilter,
  setCurrentFilter,
  tempTextValue,
  setTempTextValue,
  tempSelectValue,
  setTempSelectValue,
  tempDateRange,
  setTempDateRange,
  tempNumberRange,
  setTempNumberRange,
  addFilter
}: FilterSelectorProps) {
  const handleSelectColumn = (column: string) => {
    const selectedColumnOption = columnOptions.find(opt => opt.value === column);
    if (selectedColumnOption) {
      let initialValue: string | [Date | undefined, Date | undefined] | [number, number] | null = null;
      
      switch (selectedColumnOption.type) {
        case 'text':
          initialValue = '';
          setTempTextValue('');
          break;
        case 'select':
          initialValue = '';
          setTempSelectValue('');
          break;
        case 'dateRange':
          initialValue = [undefined, undefined];
          setTempDateRange([undefined, undefined]);
          break;
        case 'numberRange':
          initialValue = [0, 100];
          setTempNumberRange([0, 100]);
          break;
      }

      setCurrentFilter({
        column,
        value: initialValue,
        type: selectedColumnOption.type as any,
        label: selectedColumnOption.label
      });
    }
  };

  const renderFilterValueInput = () => {
    if (!currentFilter) return null;

    switch (currentFilter.type) {
      case 'text':
        return (
          <TextFilterInput
            value={tempTextValue}
            label={currentFilter.label}
            onChange={(value) => {
              setTempTextValue(value);
              setCurrentFilter({ ...currentFilter, value });
            }}
          />
        );
      case 'select':
        return (
          <SelectFilterInput
            value={tempSelectValue}
            column={currentFilter.column}
            label={currentFilter.label}
            onChange={setTempSelectValue}
          />
        );
      case 'dateRange':
        return (
          <DateRangeInput
            value={tempDateRange}
            onChange={setTempDateRange}
          />
        );
      case 'numberRange':
        return (
          <NumberRangeInput
            value={tempNumberRange}
            onChange={setTempNumberRange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <Label className="text-xs mb-1 block">Select Filter</Label>
        <Select onValueChange={handleSelectColumn}>
          <SelectTrigger>
            <SelectValue placeholder="Select column to filter" />
          </SelectTrigger>
          <SelectContent>
            {columnOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {currentFilter && (
        <>
          <div>
            <Label className="text-xs mb-1 block">Filter Value</Label>
            {renderFilterValueInput()}
          </div>
          
          <div className="flex items-end">
            <Button onClick={addFilter} className="w-full">
              Apply Filter
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
