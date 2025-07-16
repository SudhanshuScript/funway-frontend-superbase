
import React from 'react';
import { Button } from "@/components/ui/button";
import { AbandonedCart } from "@/types/bookingTypes";
import { Send, Tag, ArrowUpRight, Archive, RotateCcw, Eye } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AbandonedCartActionsProps {
  cart: AbandonedCart;
  onSendReminder: (cart: AbandonedCart) => void;
  onOfferDiscount: (cart: AbandonedCart) => void;
  onRecoverCart: (cart: AbandonedCart) => void;
  onArchiveCart: (cart: AbandonedCart) => void;
  onUnarchiveCart: (cartId: string) => Promise<boolean>;
  onViewDetails: (cart: AbandonedCart) => void;
}

export function AbandonedCartActions({
  cart,
  onSendReminder,
  onOfferDiscount,
  onRecoverCart,
  onArchiveCart,
  onUnarchiveCart,
  onViewDetails
}: AbandonedCartActionsProps) {
  return (
    <div className="flex justify-end space-x-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className="bg-accent/10 hover:bg-accent/20 text-accent-foreground transition-all duration-200 hover:scale-110"
              onClick={() => onSendReminder(cart)}
              disabled={cart.isRecovered || cart.isArchived}
            >
              <Send className="h-4 w-4 transform transition-transform duration-200" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Send Reminder</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className="bg-accent/10 hover:bg-accent/20 text-accent-foreground transition-all duration-200 hover:scale-110"
              onClick={() => onOfferDiscount(cart)}
              disabled={cart.isRecovered || cart.isArchived || !!cart.discountOffered}
            >
              <Tag className="h-4 w-4 transform transition-transform duration-200" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Offer Discount</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className="bg-spotBooking/10 hover:bg-spotBooking/20 text-spotBooking transition-all duration-200 hover:scale-110"
              onClick={() => onRecoverCart(cart)}
              disabled={cart.isRecovered || cart.isArchived}
            >
              <ArrowUpRight className="h-4 w-4 transform transition-transform duration-200" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Convert to Booking</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {!cart.isArchived ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className="bg-accent/10 hover:bg-accent/20 text-accent-foreground transition-all duration-200 hover:scale-110"
                onClick={() => onArchiveCart(cart)}
                disabled={cart.isRecovered}
              >
                <Archive className="h-4 w-4 transform transition-transform duration-200" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Archive Cart</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className="bg-accent/10 hover:bg-accent/20 text-accent-foreground transition-all duration-200 hover:scale-110"
                onClick={() => onUnarchiveCart(cart.id)}
              >
                <RotateCcw className="h-4 w-4 transform transition-transform duration-200" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Unarchive Cart</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-accent-foreground hover:bg-accent/10 transition-all duration-200 hover:scale-110"
              onClick={() => onViewDetails(cart)}
            >
              <Eye className="h-4 w-4 transform transition-transform duration-200" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>View Details</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
