
import React from 'react';
import { format } from 'date-fns';
import { 
  CalendarCheck, 
  Clock, 
  Users, 
  DollarSign,
  MapPin,
  ClipboardList,
  UserCheck
} from 'lucide-react';
import { SessionFormData } from '../modal/PublishSessionModal';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SessionReviewStepProps {
  formData: SessionFormData;
}

export const SessionReviewStep = ({ formData }: SessionReviewStepProps) => {
  // Mock staff data - would come from API in real implementation
  const mockStaffList = [
    { id: 'staff-1', name: 'John Doe', role: 'Server' },
    { id: 'staff-2', name: 'Jane Smith', role: 'Host' },
    { id: 'staff-3', name: 'Mike Johnson', role: 'Chef' },
    { id: 'staff-4', name: 'Sarah Wilson', role: 'Server' },
    { id: 'staff-5', name: 'Robert Brown', role: 'Support' },
  ];

  // Get staff details for display
  const getStaffDetails = (staffId: string) => {
    return mockStaffList.find(staff => staff.id === staffId);
  };

  // Calculate total revenue potential
  const totalRevenue = formData.pricePerPerson * formData.maxCapacity;

  // Get formatted date
  const formattedDate = formData.date ? format(new Date(formData.date), 'MMMM d, yyyy') : '';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-1">Review & Publish</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Review all session details before publishing
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-primary/10 rounded-full mr-4">
                  <CalendarCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">{formData.name}</h3>
                  <p className="text-muted-foreground">
                    {formData.sessionType === 'regular' ? 'Regular Session' : 'Special Event'}
                  </p>
                </div>
                {formData.sessionType === 'special' && (
                  <Badge className="ml-auto bg-amber-500/10 text-amber-600 border-amber-200">
                    Special Event
                  </Badge>
                )}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-sm font-medium">Date & Time</p>
                      <p className="text-sm text-muted-foreground">{formattedDate} at {formData.startTime}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-sm font-medium">Duration</p>
                      <p className="text-sm text-muted-foreground">{formData.duration} minutes</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-sm font-medium">Capacity</p>
                      <p className="text-sm text-muted-foreground">{formData.maxCapacity} guests</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-sm font-medium">Pricing</p>
                      <p className="text-sm text-muted-foreground">${formData.pricePerPerson.toFixed(2)} per person</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">
                        {formData.franchiseLocation || 'No location specified'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-green-500/10 rounded-full mr-4">
                  <DollarSign className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-medium">Revenue Projection</h3>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Total Revenue Potential</p>
                    <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Pricing Strategy</p>
                    <p className="text-sm text-muted-foreground">
                      Standard pricing ${formData.pricePerPerson.toFixed(2)} per guest
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-500/10 rounded-full mr-4">
                  <UserCheck className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium">Staff Assignment</h3>
                </div>
              </div>

              <div className="space-y-2">
                {formData.staffAssigned.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-2">
                    No staff members have been assigned to this session.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {formData.staffAssigned.map(staffId => {
                      const staff = getStaffDetails(staffId);
                      return (
                        <div key={staffId} className="flex items-center justify-between border-b pb-2">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                              <UserCheck className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{staff?.name}</p>
                              <p className="text-xs text-muted-foreground">{staff?.role}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-purple-500/10 rounded-full mr-4">
                  <ClipboardList className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-medium">Add-on Packages & Notes</h3>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Available Add-ons</h4>
                  {formData.addOnPackages.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No add-on packages selected.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {formData.addOnPackages.map((addon, index) => (
                        <Badge key={index} variant="outline">
                          {addon === 'basic' && 'Basic Package'}
                          {addon === 'prime' && 'Prime Package'}
                          {addon === 'couple' && 'Couple Package'}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Special Notes</h4>
                  <div className="border rounded-md p-3 bg-muted/30 min-h-[100px]">
                    {formData.notes || 'No special notes provided.'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-md">
        <h3 className="font-medium mb-1">Ready to Publish</h3>
        <p className="text-sm">
          This session will be published and visible to staff immediately. Guests will be able to 
          book this experience once it's active. Review all details carefully before proceeding.
        </p>
      </div>
    </div>
  );
};
