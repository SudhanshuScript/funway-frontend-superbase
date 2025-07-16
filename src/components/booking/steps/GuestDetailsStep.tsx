import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { BookingFormValues } from "../MultiStepBookingFormTypes";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Mail, Phone, User, Users, Search, AlertCircle } from "lucide-react";
import { GuestProfile } from "@/types/bookingTypes";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const searchExistingGuest = async (emailOrPhone: string): Promise<GuestProfile | null> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const mockGuests: GuestProfile[] = [
    {
      id: "g-001",
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1234567890",
      guestType: "Regular",
      foodPreference: "Non-Vegetarian",
      loyaltyPoints: 120,
      totalBookings: 5,
      specialNotes: "Prefers window seating",
      lastVisit: "2023-02-15",
      createdAt: "2022-10-01T10:30:00Z",
      updatedAt: "2023-02-15T14:20:00Z"
    },
    {
      id: "g-002",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "+9876543210",
      guestType: "VIP",
      foodPreference: "Vegetarian",
      loyaltyPoints: 350,
      totalBookings: 12,
      specialNotes: "Allergic to nuts",
      lastVisit: "2023-03-10",
      createdAt: "2021-05-12T08:45:00Z",
      updatedAt: "2023-03-10T19:15:00Z"
    }
  ];
  
  const foundGuest = mockGuests.find(
    guest => guest.email === emailOrPhone || guest.phone === emailOrPhone
  );
  
  return foundGuest || null;
};

export function GuestDetailsStep() {
  const { control, watch, setValue, getValues, formState: { errors } } = useFormContext<BookingFormValues>();
  const [searching, setSearching] = useState(false);
  const [foundGuest, setFoundGuest] = useState<GuestProfile | null>(null);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showFoundGuestDialog, setShowFoundGuestDialog] = useState(false);
  
  const numberOfGuests = watch("numberOfGuests");
  const contactNumber = watch("contactNumber");
  const email = watch("email");
  
  useEffect(() => {
    if (numberOfGuests > 0) {
      const vegCount = getValues("vegCount") || 0;
      const nonVegCount = getValues("nonVegCount") || 0;
      
      if (vegCount + nonVegCount !== numberOfGuests) {
        if (vegCount > numberOfGuests) {
          setValue("vegCount", numberOfGuests);
          setValue("nonVegCount", 0);
        } else {
          setValue("nonVegCount", numberOfGuests - vegCount);
        }
      }
      
      setValue("totalGuests", numberOfGuests);
    }
  }, [numberOfGuests, setValue, getValues]);
  
  const handleSearchExistingGuest = async () => {
    const searchValue = contactNumber || email;
    
    if (!searchValue || searchValue.length < 5) return;
    
    setSearching(true);
    try {
      const guest = await searchExistingGuest(searchValue);
      setFoundGuest(guest);
      
      if (guest) {
        setShowFoundGuestDialog(true);
      }
    } catch (error) {
      console.error("Error searching for guest:", error);
    } finally {
      setSearching(false);
    }
  };
  
  const applyGuestData = () => {
    if (!foundGuest) return;
    
    setValue("guestName", foundGuest.name);
    setValue("email", foundGuest.email);
    setValue("contactNumber", foundGuest.phone);
    setValue("customerType", foundGuest.guestType);
    
    if (foundGuest.foodPreference === "Vegetarian") {
      setValue("vegCount", numberOfGuests);
      setValue("nonVegCount", 0);
    } else if (foundGuest.foodPreference === "Non-Vegetarian") {
      setValue("vegCount", 0);
      setValue("nonVegCount", numberOfGuests);
    }
    
    setShowFoundGuestDialog(false);
    toast.success("Guest information loaded successfully!");
  };
  
  const openGuestProfile = () => {
    if (foundGuest) {
      setShowProfileDialog(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <h3 className="text-lg font-medium">Primary Guest Information</h3>
          {foundGuest && (
            <Button 
              variant="outline" 
              size="sm" 
              type="button"
              onClick={openGuestProfile}
              className="mt-2 md:mt-0"
            >
              <User className="h-4 w-4 mr-2" />
              View Guest Profile
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="guestName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Guest Name *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="John Smith" className="pl-10" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="contactNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Number *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="+1 (555) 123-4567" 
                      className="pl-10 pr-10" 
                      {...field} 
                      onBlur={(e) => {
                        field.onBlur();
                        handleSearchExistingGuest();
                      }}
                    />
                    {searching && <div className="absolute right-3 top-3 animate-spin h-4 w-4" />}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="guest@example.com" 
                      className="pl-10 pr-10" 
                      {...field} 
                      onBlur={(e) => {
                        field.onBlur();
                        handleSearchExistingGuest();
                      }}
                    />
                    {searching && <div className="absolute right-3 top-3 animate-spin h-4 w-4" />}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="customerType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Guest Classification *</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Regular" id="r-regular" />
                      <label htmlFor="r-regular" className="cursor-pointer">Regular</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="VIP" id="r-vip" />
                      <label htmlFor="r-vip" className="cursor-pointer">VIP</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="First Timer" id="r-first-timer" />
                      <label htmlFor="r-first-timer" className="cursor-pointer">First Timer</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="pt-4 border-t mt-6">
          <h3 className="text-lg font-medium mb-4">Guest Count & Food Preferences</h3>
          
          <div className="space-y-4">
            <FormField
              control={control}
              name="numberOfGuests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Guest Count *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Select
                        onValueChange={(value) => {
                          const numGuests = parseInt(value);
                          field.onChange(numGuests);
                          setValue("totalGuests", numGuests);
                        }}
                        value={field.value.toString()}
                      >
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Select guest count" />
                        </SelectTrigger>
                        <SelectContent>
                          {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num.toString().padStart(2, '0')} People
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name="vegCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vegetarian Guest Count</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          const newVegCount = parseInt(value);
                          field.onChange(newVegCount);
                          setValue("nonVegCount", numberOfGuests - newVegCount);
                        }}
                        value={field.value?.toString() || "0"}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select count" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: (numberOfGuests || 0) + 1 }, (_, i) => (
                            <SelectItem key={i} value={i.toString()}>
                              {i} {i === 1 ? "Person" : "People"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Pure vegetarian meals
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="nonVegCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Non-Vegetarian Guest Count</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          const newNonVegCount = parseInt(value);
                          field.onChange(newNonVegCount);
                          setValue("vegCount", numberOfGuests - newNonVegCount);
                        }}
                        value={field.value?.toString() || "0"}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select count" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: (numberOfGuests || 0) + 1 }, (_, i) => (
                            <SelectItem key={i} value={i.toString()}>
                              {i} {i === 1 ? "Person" : "People"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Non-vegetarian meal options
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </div>
      
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Guest Profile</DialogTitle>
            <DialogDescription>
              Complete details for {foundGuest?.name}
            </DialogDescription>
          </DialogHeader>
          
          {foundGuest && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b">
                <div>
                  <p className="text-sm text-muted-foreground">Guest Type</p>
                  <p className="font-medium">{foundGuest.guestType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Loyalty Points</p>
                  <p className="font-medium">{foundGuest.loyaltyPoints} points</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                  <p className="font-medium">{foundGuest.totalBookings} bookings</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Visit</p>
                  <p className="font-medium">{foundGuest.lastVisit || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Food Preference</p>
                  <p className="font-medium">{foundGuest.foodPreference || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-medium">{new Date(foundGuest.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="pb-4 border-b">
                <p className="text-sm text-muted-foreground mb-1">Special Notes</p>
                <p>{foundGuest.specialNotes || "No special notes recorded"}</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Booking History</h3>
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Session</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Guests</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {foundGuest.totalBookings > 0 ? (
                        Array.from({ length: Math.min(foundGuest.totalBookings, 3) }, (_, i) => (
                          <tr key={i} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                            <td className="px-4 py-2 text-sm">
                              {new Date(new Date().setDate(new Date().getDate() - (i * 30))).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-2 text-sm">
                              {["Dinner", "Lunch", "Twilight"][i % 3]}
                            </td>
                            <td className="px-4 py-2 text-sm">{2 + (i % 3)}</td>
                            <td className="px-4 py-2 text-sm">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Completed
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-4 py-2 text-sm text-center">No booking history found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {foundGuest.totalBookings > 3 && (
                  <div className="mt-2 text-right">
                    <Button variant="link" size="sm">
                      View all {foundGuest.totalBookings} bookings
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <Dialog open={showFoundGuestDialog} onOpenChange={setShowFoundGuestDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-yellow-500" />
              Previous Booking Found
            </DialogTitle>
            <DialogDescription>
              We found a previous booking for this guest. Would you like to use their information?
            </DialogDescription>
          </DialogHeader>
          
          {foundGuest && (
            <div className="space-y-4 mt-2">
              <div className="bg-muted/30 p-4 rounded-md">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="font-medium">{foundGuest.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Guest Type</p>
                    <p className="font-medium">{foundGuest.guestType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium overflow-hidden text-ellipsis">{foundGuest.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-medium">{foundGuest.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Food Preference</p>
                    <p className="font-medium">{foundGuest.foodPreference || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Bookings</p>
                    <p className="font-medium">{foundGuest.totalBookings}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button variant="outline" type="button" onClick={() => setShowFoundGuestDialog(false)}>
                  No, Enter New Details
                </Button>
                <Button type="button" onClick={applyGuestData}>
                  Yes, Load Details
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
