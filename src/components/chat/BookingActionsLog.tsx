
import React from 'react';
import { format } from 'date-fns';
import { BookingAction } from '@/types/chatTypes';
import { Calendar, CreditCard, Bell, Edit, Check } from 'lucide-react';

interface BookingActionsLogProps {
  actions: BookingAction[];
}

export function BookingActionsLog({ actions }: BookingActionsLogProps) {
  if (!actions || actions.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground text-sm">
        No booking actions yet
      </div>
    );
  }

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'modify':
        return <Edit className="h-4 w-4" />;
      case 'payment':
        return <CreditCard className="h-4 w-4" />;
      case 'reminder':
        return <Bell className="h-4 w-4" />;
      case 'confirmation':
        return <Check className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getActionText = (action: BookingAction) => {
    switch (action.action_type) {
      case 'modify':
        return `Booking modified ${action.details || ''} by ${action.performed_by}`;
      case 'payment':
        return `Payment link sent by ${action.performed_by}`;
      case 'reminder':
        return `Reminder sent ${action.details || ''}`;
      case 'confirmation':
        return `Booking confirmed by ${action.performed_by}`;
      case 'cancel':
        return `Booking cancelled by ${action.performed_by}`;
      default:
        return `Action performed by ${action.performed_by}`;
    }
  };

  return (
    <div className="space-y-2 p-3 border-t">
      <h4 className="text-sm font-medium">Booking Timeline</h4>
      <ul className="space-y-2">
        {actions.map((action) => (
          <li key={action.id} className="flex items-start gap-2 text-xs">
            <span className="bg-muted rounded-full p-1 mt-0.5">
              {getActionIcon(action.action_type)}
            </span>
            <div className="flex-1">
              <p>{getActionText(action)}</p>
              <p className="text-muted-foreground">
                {format(new Date(action.performed_at), 'MMM dd, h:mm a')}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
