
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { OfferFormData } from '@/types/offerTypes';
import { Calendar, CalendarClock, Clock, Info, Tag, Target, User } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OfferPreviewStepProps {
  formData: OfferFormData;
  updateFormData: (data: OfferFormData) => void;
}

const OfferPreviewStep = ({ formData, updateFormData }: OfferPreviewStepProps) => {
  const getFranchiseName = (id: string) => {
    switch (id) {
      case 'franchise-1': return 'FlyDining Central';
      case 'franchise-2': return 'FlyDining North';
      case 'franchise-3': return 'FlyDining South';
      case 'all': return 'All Franchises';
      default: return id;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 border rounded-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-semibold">{formData.name}</h2>
            <div className="flex items-center mt-1">
              <Badge variant="outline" className="bg-primary/10 text-xs font-mono mr-2">
                {formData.code}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {formData.type}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <Label className="text-sm text-muted-foreground">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: any) => updateFormData({ ...formData, status: value })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Change status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Pending">Submit for Approval</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="flex items-center text-sm font-medium mb-4">
                <Tag className="mr-2 h-4 w-4" /> Offer Details
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Discount Type & Value</Label>
                  <p className="font-medium">
                    {formData.discountType === 'Percentage' && `${formData.discountValue}% off`}
                    {formData.discountType === 'Fixed Amount' && `₹${formData.discountValue} off`}
                    {formData.discountType === 'Free Add-On' && `${formData.discountValue} free add-on(s)`}
                  </p>
                </div>
                
                <div>
                  <Label className="text-xs text-muted-foreground">Validity Period</Label>
                  <p className="font-medium flex items-center">
                    <CalendarClock className="mr-2 h-4 w-4" />
                    {format(new Date(formData.validFrom), 'MMM d, yyyy')} - {format(new Date(formData.validTo), 'MMM d, yyyy')}
                  </p>
                </div>
                
                <div>
                  <Label className="text-xs text-muted-foreground">Validity Type</Label>
                  <p className="font-medium">
                    {formData.validityType}
                  </p>
                </div>
                
                <div>
                  <Label className="text-xs text-muted-foreground">Usage Limits</Label>
                  <p className="font-medium">
                    Max: {formData.maxRedemptions} total redemptions
                    <br />
                    {formData.perGuestLimit} per guest
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="flex items-center text-sm font-medium mb-4">
                <Target className="mr-2 h-4 w-4" /> Targeting & Delivery
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Guest Segments</Label>
                  <p className="font-medium flex flex-wrap gap-1 mt-1">
                    {formData.guestSegments.map(segment => (
                      <Badge key={segment} variant="secondary" className="text-xs">
                        {segment}
                      </Badge>
                    ))}
                  </p>
                </div>
                
                <div>
                  <Label className="text-xs text-muted-foreground">Franchise Assignment</Label>
                  <p className="font-medium">
                    {formData.franchiseIds.map(id => getFranchiseName(id)).join(', ')}
                  </p>
                </div>
                
                <div>
                  <Label className="text-xs text-muted-foreground">Delivery Channels</Label>
                  <p className="font-medium flex flex-wrap gap-1 mt-1">
                    {formData.deliveryChannels.map(channel => (
                      <Badge key={channel} variant="outline" className="text-xs">
                        {channel}
                      </Badge>
                    ))}
                  </p>
                </div>
                
                {formData.status === 'Scheduled' && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Scheduled Publication</Label>
                    <p className="font-medium flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      {formData.scheduleDate ? format(new Date(formData.scheduleDate), 'MMM d, yyyy') : 'Not scheduled'}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {formData.status === 'Pending' && (
          <div className="mt-6 bg-blue-50 p-4 rounded-md border border-blue-100">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-700">Approval Process</h4>
                <p className="text-sm text-blue-600 mt-1">
                  This offer will be submitted for approval by a Superadmin.
                  You'll be notified when it's reviewed.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferPreviewStep;
