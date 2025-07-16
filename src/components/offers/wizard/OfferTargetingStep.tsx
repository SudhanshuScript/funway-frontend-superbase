
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Select, 
  SelectContent, 
  SelectGroup,
  SelectItem, 
  SelectLabel,
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Info } from "lucide-react";
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { OfferFormData, GuestSegment, DeliveryChannel } from '@/types/offerTypes';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

interface OfferTargetingStepProps {
  formData: OfferFormData;
  updateFormData: (data: OfferFormData) => void;
}

// Mock sessions data
const mockSessions = [
  { id: 'session-1', name: 'Breakfast Flight', type: 'Regular' },
  { id: 'session-2', name: 'Sunset Dinner', type: 'Premium' },
  { id: 'session-3', name: 'Weekend Brunch', type: 'Special' },
  { id: 'session-4', name: 'Afternoon Tea', type: 'Regular' },
  { id: 'session-5', name: 'Moonlight Dinner', type: 'Premium' },
];

const OfferTargetingStep = ({ formData, updateFormData }: OfferTargetingStepProps) => {
  const handleGuestSegmentChange = (segment: GuestSegment) => {
    if (segment === 'All') {
      updateFormData({
        ...formData,
        guestSegments: ['All']
      });
      return;
    }

    let newSegments = [...formData.guestSegments];
    
    // Remove 'All' if it exists
    newSegments = newSegments.filter(s => s !== 'All');
    
    // Toggle the selected segment
    if (newSegments.includes(segment)) {
      newSegments = newSegments.filter(s => s !== segment);
    } else {
      newSegments.push(segment);
    }
    
    // If no segments are selected, default to 'All'
    if (newSegments.length === 0) {
      newSegments = ['All'];
    }
    
    updateFormData({
      ...formData,
      guestSegments: newSegments
    });
  };

  const handleDeliveryChannelChange = (channel: DeliveryChannel) => {
    if (channel === 'All') {
      updateFormData({
        ...formData,
        deliveryChannels: ['All']
      });
      return;
    }

    let newChannels = [...formData.deliveryChannels];
    
    // Remove 'All' if it exists
    newChannels = newChannels.filter(c => c !== 'All');
    
    // Toggle the selected channel
    if (newChannels.includes(channel)) {
      newChannels = newChannels.filter(c => c !== channel);
    } else {
      newChannels.push(channel);
    }
    
    // If no channels are selected, default to 'All'
    if (newChannels.length === 0) {
      newChannels = ['All'];
    }
    
    updateFormData({
      ...formData,
      deliveryChannels: newChannels
    });
  };

  const handleSessionToggle = (sessionId: string) => {
    let newSessionIds = [...formData.sessionIds];
    
    if (newSessionIds.includes(sessionId)) {
      newSessionIds = newSessionIds.filter(id => id !== sessionId);
    } else {
      newSessionIds.push(sessionId);
    }
    
    updateFormData({
      ...formData,
      sessionIds: newSessionIds
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center">
          <Label>Guest Segments</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="ml-2 h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Select which guest segments this offer applies to
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="guestAll"
              checked={formData.guestSegments.includes('All')}
              onCheckedChange={() => handleGuestSegmentChange('All')}
            />
            <Label htmlFor="guestAll" className="text-sm">All Guests</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="guestVIP"
              checked={formData.guestSegments.includes('VIP')}
              onCheckedChange={() => handleGuestSegmentChange('VIP')}
              disabled={formData.guestSegments.includes('All')}
            />
            <Label htmlFor="guestVIP" className="text-sm">VIP</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="guestRegular"
              checked={formData.guestSegments.includes('Regular')}
              onCheckedChange={() => handleGuestSegmentChange('Regular')}
              disabled={formData.guestSegments.includes('All')}
            />
            <Label htmlFor="guestRegular" className="text-sm">Regular</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="guestNew"
              checked={formData.guestSegments.includes('New')}
              onCheckedChange={() => handleGuestSegmentChange('New')}
              disabled={formData.guestSegments.includes('All')}
            />
            <Label htmlFor="guestNew" className="text-sm">New</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="guestFirstTime"
              checked={formData.guestSegments.includes('First-Time')}
              onCheckedChange={() => handleGuestSegmentChange('First-Time')}
              disabled={formData.guestSegments.includes('All')}
            />
            <Label htmlFor="guestFirstTime" className="text-sm">First-Time</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="guestUnregistered"
              checked={formData.guestSegments.includes('Unregistered')}
              onCheckedChange={() => handleGuestSegmentChange('Unregistered')}
              disabled={formData.guestSegments.includes('All')}
            />
            <Label htmlFor="guestUnregistered" className="text-sm">Unregistered</Label>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <Label>Franchise Assignment</Label>
        </div>
        <Select 
          value={formData.franchiseIds[0]} 
          onValueChange={(value) => updateFormData({ ...formData, franchiseIds: [value] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select franchise(s)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Franchises</SelectItem>
            <SelectItem value="franchise-1">FlyDining Central</SelectItem>
            <SelectItem value="franchise-2">FlyDining North</SelectItem>
            <SelectItem value="franchise-3">FlyDining South</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Choose which franchise locations this offer will be available at
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <Label>Delivery Channels</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="ml-2 h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Select how this offer will be distributed to guests
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="channelAll"
              checked={formData.deliveryChannels.includes('All')}
              onCheckedChange={() => handleDeliveryChannelChange('All')}
            />
            <Label htmlFor="channelAll" className="text-sm">All Channels</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="channelEmail"
              checked={formData.deliveryChannels.includes('Email')}
              onCheckedChange={() => handleDeliveryChannelChange('Email')}
              disabled={formData.deliveryChannels.includes('All')}
            />
            <Label htmlFor="channelEmail" className="text-sm">Email</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="channelWhatsApp"
              checked={formData.deliveryChannels.includes('WhatsApp')}
              onCheckedChange={() => handleDeliveryChannelChange('WhatsApp')}
              disabled={formData.deliveryChannels.includes('All')}
            />
            <Label htmlFor="channelWhatsApp" className="text-sm">WhatsApp</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="channelTelegram"
              checked={formData.deliveryChannels.includes('Telegram')}
              onCheckedChange={() => handleDeliveryChannelChange('Telegram')}
              disabled={formData.deliveryChannels.includes('All')}
            />
            <Label htmlFor="channelTelegram" className="text-sm">Telegram</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="channelInApp"
              checked={formData.deliveryChannels.includes('In-App')}
              onCheckedChange={() => handleDeliveryChannelChange('In-App')}
              disabled={formData.deliveryChannels.includes('All')}
            />
            <Label htmlFor="channelInApp" className="text-sm">In-App</Label>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <Label>Session Applicability</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="ml-2 h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Select which session types this offer can be applied to
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto border rounded-md p-2">
          {mockSessions.map(session => (
            <div key={session.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id={`session-${session.id}`}
                  checked={formData.sessionIds.includes(session.id)}
                  onCheckedChange={() => handleSessionToggle(session.id)}
                />
                <div>
                  <Label htmlFor={`session-${session.id}`} className="text-sm">{session.name}</Label>
                  <Badge variant="outline" className="ml-2 text-xs">
                    {session.type}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {formData.sessionIds.length === 0 
            ? "No sessions selected (offer will apply to all sessions)" 
            : `${formData.sessionIds.length} session(s) selected`}
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <Label>Schedule Offer</Label>
        </div>
        <RadioGroup 
          value={formData.status} 
          onValueChange={(value: any) => updateFormData({ ...formData, status: value })}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Draft" id="draft" />
            <Label htmlFor="draft">Save as Draft</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Active" id="publishNow" />
            <Label htmlFor="publishNow">Publish Immediately</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Scheduled" id="schedule" />
            <Label htmlFor="schedule">Schedule for Later</Label>
          </div>
        </RadioGroup>
        
        {formData.status === 'Scheduled' && (
          <div className="pl-6 pt-2">
            <Label htmlFor="scheduleDate" className="mb-2 block">Schedule Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="scheduleDate"
                  variant="outline"
                  className="w-[240px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.scheduleDate ? (
                    format(new Date(formData.scheduleDate), 'PPP')
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.scheduleDate ? new Date(formData.scheduleDate) : undefined}
                  onSelect={(date) => date && updateFormData({ ...formData, scheduleDate: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferTargetingStep;
