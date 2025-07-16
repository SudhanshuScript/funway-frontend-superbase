
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { SessionFormData } from '../modal/PublishSessionModal';

interface SessionStaffStepProps {
  formData: SessionFormData;
  onFormChange: (data: Partial<SessionFormData>) => void;
}

// Mock staff data - would come from API in real implementation
const mockStaffList = [
  { id: 'staff-1', name: 'John Doe', role: 'Server' },
  { id: 'staff-2', name: 'Jane Smith', role: 'Host' },
  { id: 'staff-3', name: 'Mike Johnson', role: 'Chef' },
  { id: 'staff-4', name: 'Sarah Wilson', role: 'Server' },
  { id: 'staff-5', name: 'Robert Brown', role: 'Support' },
];

// Mock franchise locations
const franchiseLocations = [
  'Downtown Sky Bistro',
  'Waterfront View',
  'Central Tower',
  'Hillside Retreat',
  'Beachside Experience',
];

export const SessionStaffStep = ({ formData, onFormChange }: SessionStaffStepProps) => {
  const [selectedStaff, setSelectedStaff] = useState<string>('');

  const handleLocationChange = (value: string) => {
    onFormChange({ franchiseLocation: value });
  };

  const handleAddStaff = () => {
    if (selectedStaff && !formData.staffAssigned.includes(selectedStaff)) {
      onFormChange({ staffAssigned: [...formData.staffAssigned, selectedStaff] });
      setSelectedStaff('');
    }
  };

  const handleRemoveStaff = (staffId: string) => {
    onFormChange({
      staffAssigned: formData.staffAssigned.filter(id => id !== staffId)
    });
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onFormChange({ notes: e.target.value });
  };

  // Get staff details for display
  const getStaffDetails = (staffId: string) => {
    return mockStaffList.find(staff => staff.id === staffId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-1">Staff & Location</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Assign staff and add additional details
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="location">Franchise Location</Label>
            <Select
              value={formData.franchiseLocation}
              onValueChange={handleLocationChange}
            >
              <SelectTrigger id="location">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {franchiseLocations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Select the location where this session will be held
            </p>
          </div>

          <div className="space-y-2">
            <Label>Assigned Staff</Label>
            <div className="flex gap-2">
              <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                <SelectTrigger>
                  <SelectValue placeholder="Select staff member" />
                </SelectTrigger>
                <SelectContent>
                  {mockStaffList.map((staff) => (
                    <SelectItem key={staff.id} value={staff.id}>
                      {staff.name} ({staff.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="secondary" onClick={handleAddStaff} disabled={!selectedStaff}>
                Add Staff
              </Button>
            </div>

            <div className="border rounded-md p-4 mt-2 min-h-[100px]">
              {formData.staffAssigned.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center">
                  No staff assigned yet
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {formData.staffAssigned.map((staffId) => {
                    const staff = getStaffDetails(staffId);
                    return (
                      <Badge key={staffId} variant="secondary" className="flex items-center gap-1">
                        {staff?.name} ({staff?.role})
                        <button 
                          onClick={() => handleRemoveStaff(staffId)}
                          className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove</span>
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Special Notes & Instructions</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={handleNoteChange}
              placeholder="Add any special instructions, requirements, or highlights for this session..."
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              These notes will be visible to staff and can include special requirements
            </p>
          </div>

          <div className="bg-muted p-4 rounded-md mt-4">
            <h3 className="text-sm font-medium">Staff Requirements</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Based on capacity ({formData.maxCapacity} guests), you should assign at least {Math.ceil(formData.maxCapacity / 10)} staff members to this session.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
