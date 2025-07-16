
import React from "react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CalendarIcon, Clock, Users, DollarSign, MapPin, FileText } from "lucide-react";

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

interface ReviewPublishStepProps {
  formData: any;
}

export function ReviewPublishStep({ formData }: ReviewPublishStepProps) {
  function calculateEndTime(startTime: string, durationMinutes: string) {
    const [hours, minutes] = startTime.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    
    date.setMinutes(date.getMinutes() + parseInt(durationMinutes));
    
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }

  const endTime = calculateEndTime(formData.startTime, formData.duration);

  const selectedStaff = staffMembers.filter(staff => 
    formData.staffAssigned.includes(staff.id)
  );

  const franchiseLocation = franchiseLocations.find(
    location => location.id === formData.franchiseLocation
  );

  const addOnOptions = [
    { id: "basic", label: "Basic (Standard amenities)", price: 0 },
    { id: "premium", label: "Premium (Enhanced experience)", price: 29.99 },
    { id: "couple", label: "Couple Package (Romantic setup)", price: 49.99 },
    { id: "vip", label: "VIP (Exclusive perks & priority seating)", price: 79.99 }
  ];

  const selectedAddOns = addOnOptions.filter(addon => 
    formData.addOnPackages.includes(addon.id)
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-medium">Review & Publish</h2>
        <p className="text-sm text-muted-foreground">
          Review all session details before publishing
        </p>
      </div>

      <div className="space-y-6">
        {/* Session Header */}
        <div className="border rounded-lg p-4 bg-muted/30">
          <h3 className="text-xl font-medium">{formData.name}</h3>
          <Badge className={formData.sessionType === "special" ? "bg-purple-500" : "bg-blue-500"}>
            {formData.sessionType === "special" ? "Special Event" : "Regular Event"}
          </Badge>
          <div className="mt-2 text-sm">
            <span className="inline-flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              {format(formData.date, "EEEE, MMMM d, yyyy")}
            </span>
            <span className="inline-flex items-center gap-2 ml-4">
              <Clock className="h-4 w-4 text-muted-foreground" />
              {formData.startTime} - {endTime} ({formData.duration} minutes)
            </span>
          </div>
        </div>

        {/* Session Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <h4 className="font-medium flex items-center gap-2">
              <Users className="h-4 w-4" /> Capacity & Pricing
            </h4>
            <div className="mt-2 space-y-2 text-sm">
              <p>Guest capacity: <span className="font-medium">{formData.maxCapacity}</span></p>
              <p>Price per person: <span className="font-medium">${formData.pricePerPerson.toFixed(2)}</span></p>
              <div className="pt-2">
                <p className="text-xs font-medium mb-1">Food Preferences:</p>
                <Badge variant="outline">
                  {formData.foodPreference === "vegetarian" ? "Vegetarian Only" : 
                   formData.foodPreference === "non-vegetarian" ? "Non-Vegetarian Only" : 
                   "Both Vegetarian & Non-Vegetarian"}
                </Badge>
              </div>
              <div className="pt-2">
                <p className="text-xs font-medium mb-1">Add-on Packages:</p>
                {selectedAddOns.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {selectedAddOns.map(addon => (
                      <Badge key={addon.id} variant="outline" className="text-xs">
                        {addon.label}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">No add-ons selected</span>
                )}
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Staff & Location
            </h4>
            <div className="mt-2 space-y-2 text-sm">
              <div>
                <p className="text-xs font-medium mb-1">Assigned Staff:</p>
                {selectedStaff.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {selectedStaff.map(staff => (
                      <Badge key={staff.id} variant="secondary" className="text-xs">
                        {staff.name} ({staff.role})
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">No staff assigned</span>
                )}
              </div>
              <p className="pt-2">
                Location: <span className="font-medium">{franchiseLocation?.name || "Not specified"}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        {formData.notes && (
          <div className="border rounded-lg p-4">
            <h4 className="font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" /> Special Notes
            </h4>
            <p className="mt-2 text-sm whitespace-pre-line">{formData.notes}</p>
          </div>
        )}
        
        {/* Summary Alert */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <div className="text-green-600 bg-green-100 p-1 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
          </div>
          <div>
            <h5 className="font-medium text-green-800">Ready to publish</h5>
            <p className="text-sm text-green-700">
              Your session is ready to be published. Review all details carefully before proceeding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
