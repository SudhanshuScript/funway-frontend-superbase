
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface StaffLocationStepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

// Mock staff data - in a real app, this would be fetched from an API
const staffMembers = [
  { id: "staff-1", name: "John Doe", role: "Flight Attendant" },
  { id: "staff-2", name: "Jane Smith", role: "Chef" },
  { id: "staff-3", name: "Robert Johnson", role: "Host" },
  { id: "staff-4", name: "Emily Williams", role: "Server" },
  { id: "staff-5", name: "Michael Brown", role: "Safety Officer" },
];

// Mock franchise locations - in a real app, this would be fetched from an API
const franchiseLocations = [
  { id: "loc-1", name: "Downtown Tower" },
  { id: "loc-2", name: "Skyview Heights" },
  { id: "loc-3", name: "Lakeside Pavilion" },
  { id: "loc-4", name: "Mountain Peak" },
];

export function StaffLocationStep({ formData, updateFormData }: StaffLocationStepProps) {
  const [staffSearch, setStaffSearch] = useState("");
  
  const handleStaffSelect = (staffId: string) => {
    const isAlreadySelected = formData.staffAssigned.includes(staffId);
    
    if (!isAlreadySelected) {
      updateFormData({ 
        staffAssigned: [...formData.staffAssigned, staffId] 
      });
    }
    
    setStaffSearch("");
  };
  
  const handleStaffRemove = (staffId: string) => {
    updateFormData({ 
      staffAssigned: formData.staffAssigned.filter((id: string) => id !== staffId) 
    });
  };
  
  const filteredStaff = staffMembers.filter(
    staff => 
      !formData.staffAssigned.includes(staff.id) && 
      (staff.name.toLowerCase().includes(staffSearch.toLowerCase()) || 
       staff.role.toLowerCase().includes(staffSearch.toLowerCase()))
  );
  
  const selectedStaff = staffMembers.filter(staff => 
    formData.staffAssigned.includes(staff.id)
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-medium">Staff & Location</h2>
        <p className="text-sm text-muted-foreground">
          Assign staff members and set the location for this session
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <Label>Assign Staff</Label>
          
          <div className="space-y-2">
            <Input
              placeholder="Search staff by name or role..."
              value={staffSearch}
              onChange={(e) => setStaffSearch(e.target.value)}
            />
            
            {staffSearch && filteredStaff.length > 0 && (
              <div className="border rounded-md overflow-hidden max-h-60 overflow-y-auto">
                {filteredStaff.map(staff => (
                  <div 
                    key={staff.id}
                    className="p-2 hover:bg-muted/50 cursor-pointer border-b last:border-0"
                    onClick={() => handleStaffSelect(staff.id)}
                  >
                    <div className="font-medium">{staff.name}</div>
                    <div className="text-xs text-muted-foreground">{staff.role}</div>
                  </div>
                ))}
              </div>
            )}
            
            {selectedStaff.length > 0 ? (
              <div className="mt-2 border rounded-md p-3">
                <Label className="block mb-2">Assigned Staff:</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedStaff.map(staff => (
                    <Badge key={staff.id} variant="secondary" className="px-3 py-1.5">
                      {staff.name} ({staff.role})
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-4 w-4 p-0 rounded-full"
                        onClick={() => handleStaffRemove(staff.id)}
                      >
                        <X className="h-2.5 w-2.5" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-2">
                No staff assigned yet. Search and select staff members above.
              </p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="franchiseLocation">Franchise Location</Label>
          <Select
            value={formData.franchiseLocation}
            onValueChange={(value) => updateFormData({ franchiseLocation: value })}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select franchise location" />
            </SelectTrigger>
            <SelectContent>
              {franchiseLocations.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="notes">Special Notes</Label>
          <Textarea
            id="notes"
            placeholder="Enter any special notes, requirements or instructions for this session..."
            value={formData.notes}
            onChange={(e) => updateFormData({ notes: e.target.value })}
            rows={4}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
}
