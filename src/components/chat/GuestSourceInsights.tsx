
import React from 'react';
import { Smartphone, Globe, MapPin } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Conversation } from '@/types/chatTypes';

interface GuestSourceInsightsProps {
  conversation: Conversation | undefined;
}

export function GuestSourceInsights({ conversation }: GuestSourceInsightsProps) {
  if (!conversation) return null;

  const source = conversation.source || 'Unknown';
  const device = conversation.device || 'Unknown';
  const platform = conversation.platform;
  const franchise = conversation.franchise_name;

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-muted/50 text-xs text-muted-foreground">
      <Tooltip>
        <TooltipTrigger className="cursor-default flex items-center gap-1">
          <Globe className="h-3 w-3" />
          <span>Source: {source}</span>
        </TooltipTrigger>
        <TooltipContent>Guest acquisition source</TooltipContent>
      </Tooltip>
      
      <span>|</span>
      
      <Tooltip>
        <TooltipTrigger className="cursor-default flex items-center gap-1">
          <Smartphone className="h-3 w-3" />
          <span>Device: {device}</span>
        </TooltipTrigger>
        <TooltipContent>Guest's device type</TooltipContent>
      </Tooltip>
      
      <span>|</span>
      
      <span>Via: {platform}</span>
      
      <span>|</span>
      
      <Tooltip>
        <TooltipTrigger className="cursor-default flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          <span>Franchise: {franchise}</span>
        </TooltipTrigger>
        <TooltipContent>Associated franchise location</TooltipContent>
      </Tooltip>
    </div>
  );
}
