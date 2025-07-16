
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AbandonedCart } from "@/types/bookingTypes";
import { format, parseISO } from 'date-fns';
import { AbandonedCartActions } from './AbandonedCartActions';
import { AbandonmentReasonBadge, ReminderStatusBadge } from './AbandonedCartStatusBadge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AbandonedCartRowProps {
  cart: AbandonedCart;
  onSendReminder: (cart: AbandonedCart) => void;
  onOfferDiscount: (cart: AbandonedCart) => void;
  onRecoverCart: (cart: AbandonedCart) => void;
  onArchiveCart: (cart: AbandonedCart) => void;
  onUnarchiveCart: (cartId: string) => Promise<boolean>;
  onViewDetails: (cart: AbandonedCart) => void;
}

export function AbandonedCartRow({
  cart,
  onSendReminder,
  onOfferDiscount,
  onRecoverCart,
  onArchiveCart,
  onUnarchiveCart,
  onViewDetails
}: AbandonedCartRowProps) {
  // Function to get guest type tooltip content
  const getGuestTypeTooltip = (guestType: string) => {
    switch (guestType) {
      case "VIP":
        return "Premium guest with special privileges and higher spending average";
      case "Regular":
        return "Returning guest who has dined with us before";
      case "First Timer":
        return "First visit to our restaurant - special opportunity to impress";
      default:
        return "Guest information";
    }
  };

  const getGuestTypeBadgeStyles = (guestType: string) => {
    switch (guestType) {
      case "VIP":
        return "gyro-badge gyro-badge-warning";
      case "First Timer":
        return "gyro-badge gyro-badge-blue";
      default:
        return "gyro-badge gyro-badge-purple";
    }
  };

  return (
    <TableRow key={cart.id} className="hover:bg-gyro-cardHover border-b border-gyro-border transition-colors group">
      <TableCell className="font-medium text-gray-300">{cart.id}</TableCell>
      <TableCell>
        <div>
          <div className="font-medium text-white">{cart.guestName}</div>
          <div className="text-xs text-gray-400 flex items-center gap-1">
            <span>+{cart.totalGuests}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge 
                    variant="outline"
                    className={`transition-all ${getGuestTypeBadgeStyles(cart.guestType)}`}
                  >
                    {cart.guestType}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent side="right" className="p-3 max-w-[220px] bg-gyro-dark border-gyro-border shadow-xl shadow-black/20">
                  <div>
                    <p className="font-semibold uppercase tracking-wide text-sm">{cart.guestType}</p>
                    <p className="text-sm mt-1 text-gray-300">{getGuestTypeTooltip(cart.guestType)}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-gray-300">{cart.sessionName}</TableCell>
      <TableCell className="text-gray-300">{format(new Date(cart.bookingDate), 'MMM d, yyyy')}</TableCell>
      <TableCell className="text-gray-300">{format(parseISO(cart.abandonmentTimestamp), 'MMM d, yyyy h:mm a')}</TableCell>
      <TableCell>
        <AbandonmentReasonBadge reason={cart.abandonmentReason} />
      </TableCell>
      <TableCell>
        <ReminderStatusBadge 
          status={cart.reminderStatus} 
          lastReminderSent={cart.lastReminderSent}
          reminderCount={cart.reminderCount}
        />
      </TableCell>
      <TableCell className="text-right sticky right-0 bg-gyro-dark shadow-sm dark:bg-gyro-dark group-hover:bg-gyro-cardHover transition-colors">
        <AbandonedCartActions
          cart={cart}
          onSendReminder={onSendReminder}
          onOfferDiscount={onOfferDiscount}
          onRecoverCart={onRecoverCart}
          onArchiveCart={onArchiveCart}
          onUnarchiveCart={onUnarchiveCart}
          onViewDetails={onViewDetails}
        />
      </TableCell>
    </TableRow>
  );
}
