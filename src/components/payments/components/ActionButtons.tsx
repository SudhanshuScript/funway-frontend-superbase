
import React from 'react';
import { Button } from "@/components/ui/button";
import { Send, Calendar, PlusCircle, Eye } from "lucide-react";
import { Transaction } from "../types";

interface ActionButtonsProps {
  transaction: Transaction;
  onSendReminder: (id: string) => void;
  onReschedule: (transaction: Transaction) => void;
  onAddGuests: (transaction: Transaction) => void;
}

export function ActionButtons({
  transaction,
  onSendReminder,
  onReschedule,
  onAddGuests
}: ActionButtonsProps) {
  const isPendingOrPartial = transaction.status === "Pending" || transaction.status === "Partial" || transaction.status === "Overdue";
  
  return (
    <div className="flex space-x-1 bg-background/80 dark:bg-background/30 px-2 py-1 rounded-md">
      {isPendingOrPartial && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onSendReminder(transaction.id)}
          title="Send Payment Reminder"
          className="text-muted-foreground border-border hover:bg-accent/10 hover:text-accent-foreground"
        >
          <Send className="h-3 w-3 mr-1" />
          <span className="hidden sm:inline">Remind</span>
        </Button>
      )}
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onReschedule(transaction)}
        title="Reschedule Booking"
        className="text-muted-foreground border-border hover:bg-accent/10 hover:text-accent-foreground"
      >
        <Calendar className="h-3 w-3 mr-1" />
        <span className="hidden sm:inline">Reschedule</span>
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => onAddGuests(transaction)}
        title="Add Guests"
        className="text-muted-foreground border-border hover:bg-accent/10 hover:text-accent-foreground"
      >
        <PlusCircle className="h-3 w-3 mr-1" />
        <span className="hidden sm:inline">Add Guests</span>
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        title="View Details"
        className="text-muted-foreground hover:bg-accent/10 hover:text-accent-foreground"
      >
        <Eye className="h-4 w-4" />
      </Button>
    </div>
  );
}
