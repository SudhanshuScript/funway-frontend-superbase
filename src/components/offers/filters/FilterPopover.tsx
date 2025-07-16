
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Popover, 
  PopoverTrigger, 
  PopoverContent
} from '@/components/ui/popover';
import { Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { OfferFilters } from '@/types/offerTypes';

interface FilterPopoverProps {
  filters: OfferFilters;
  activeFilterCount: number;
  children: React.ReactNode;
}

const FilterPopover = ({ filters, activeFilterCount, children }: FilterPopoverProps) => {
  const [open, setOpen] = React.useState(false);
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="relative">
          <Filter className="mr-2 h-4 w-4" /> Filter by Type
          {activeFilterCount > 0 && (
            <Badge className="ml-2 bg-primary text-primary-foreground">{activeFilterCount}</Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-4" align="end">
        {children}
      </PopoverContent>
    </Popover>
  );
};

export default FilterPopover;
