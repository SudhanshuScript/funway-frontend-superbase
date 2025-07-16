
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarClock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from 'date-fns';
import { Offer } from '@/types/offerTypes';
import OfferStatusBadge from './OfferStatusBadge';
import DiscountBadge from './DiscountBadge';
import OfferUsageIndicator from './OfferUsageIndicator';
import OfferActionButtons from './OfferActionButtons';

interface OfferTableRowProps {
  offer: Offer;
}

const OfferTableRow = ({ offer }: OfferTableRowProps) => {
  return (
    <TableRow key={offer.id} className="group">
      <TableCell className="font-medium">{offer.id}</TableCell>
      <TableCell>
        <div>
          <div className="font-medium">{offer.name}</div>
          <Badge variant="outline" className="bg-primary/10 text-xs font-mono mt-1">
            {offer.code}
          </Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center text-xs rounded-full px-2 py-0.5 bg-slate-100 text-slate-700">
                  {offer.type}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Offer Type</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </TableCell>
      <TableCell>
        <DiscountBadge type={offer.discountType} value={offer.discountValue} />
      </TableCell>
      <TableCell>{offer.validityType}</TableCell>
      <TableCell>
        <div className="flex items-center">
          <CalendarClock className="mr-1 h-3 w-3 text-muted-foreground" />
          <span className="text-sm">
            {format(new Date(offer.validFrom), 'MMM d')} - {format(new Date(offer.validTo), 'MMM d, yyyy')}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <OfferStatusBadge status={offer.status} />
      </TableCell>
      <TableCell>
        <OfferUsageIndicator 
          redemptions={offer.redemptions}
          maxRedemptions={offer.maxRedemptions}
          conversionRate={offer.conversionRate}
          sentCount={offer.sentCount}
          viewedCount={offer.viewedCount}
          redeemedCount={offer.redeemedCount}
        />
      </TableCell>
      <TableCell className="text-right">
        <OfferActionButtons />
      </TableCell>
    </TableRow>
  );
};

export default OfferTableRow;
