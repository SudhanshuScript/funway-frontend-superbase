
import React from 'react';
import { BookingSummary, QuickReply } from '@/types/chatTypes';
import { Button } from '@/components/ui/button';
import { Bell, CreditCard, Map, Calendar, FileText } from 'lucide-react';

interface AutoSuggestionPanelProps {
  isVisible: boolean;
  bookingSummary: BookingSummary | null;
  quickReplies: QuickReply[];
  onSendSuggestion: (content: string) => void;
  onSendBookingConfirmation: () => void;
  onSendDirections: () => void;
  onSendPaymentLink: () => void;
}

export function AutoSuggestionPanel({
  isVisible,
  bookingSummary,
  quickReplies,
  onSendSuggestion,
  onSendBookingConfirmation,
  onSendDirections,
  onSendPaymentLink
}: AutoSuggestionPanelProps) {
  if (!isVisible) return null;

  const suggestedReplies = quickReplies.slice(0, 3);

  return (
    <div className="border-t bg-muted/30 p-2">
      <div className="mb-2">
        <span className="text-xs font-medium text-muted-foreground">Quick Replies</span>
        <div className="flex flex-wrap gap-1 mt-1">
          {suggestedReplies.map((reply) => (
            <Button
              key={reply.id}
              variant="secondary"
              size="sm"
              className="h-7 text-xs"
              onClick={() => onSendSuggestion(reply.content)}
            >
              {reply.title}
            </Button>
          ))}
        </div>
      </div>

      {bookingSummary && (
        <div className="mt-2">
          <span className="text-xs font-medium text-muted-foreground">Would you like to...</span>
          <div className="flex flex-wrap gap-1 mt-1">
            <Button
              variant="secondary"
              size="sm"
              className="h-7 text-xs"
              onClick={onSendBookingConfirmation}
            >
              <Calendar className="h-3 w-3 mr-1" />
              Resend Confirmation
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="h-7 text-xs"
              onClick={onSendDirections}
            >
              <Map className="h-3 w-3 mr-1" />
              Share Directions
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="h-7 text-xs"
              onClick={onSendPaymentLink}
            >
              <CreditCard className="h-3 w-3 mr-1" />
              Send Payment Link
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
