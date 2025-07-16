
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { CalendarIcon, CreditCard, Check, Users } from "lucide-react";
import { toast } from "sonner";
import { useUserRole } from "@/providers/UserRoleProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { mockBookingSystem } from "@/utils/mockBookingSystem";
import { GuestType } from "@/types/bookingTypes";

type SpotBookingFormData = {
  guestName: string;
  contactNumber: string;
  email: string;
  sessionId: string;
  guestCount: number;
  addons: string[];
  paymentMethod: string;
  notes: string;
  bookingDate: Date;
  isPaid: boolean;
  transactionId: string;
  guestType: GuestType;
};

// Mock session data - in a real app, this would come from an API call
const mockSessions = [
  { id: "ses-001", name: "Breakfast - 8:00 AM", maxCapacity: 30, remaining: 12 },
  { id: "ses-002", name: "Lunch - 12:30 PM", maxCapacity: 40, remaining: 8 },
  { id: "ses-003", name: "Dinner - 7:00 PM", maxCapacity: 40, remaining: 15 },
  { id: "ses-004", name: "Special Event - 6:00 PM", maxCapacity: 20, remaining: 5 },
];

interface SpotBookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultGuestType?: GuestType;
}

export const SpotBookingModal: React.FC<SpotBookingModalProps> = ({ 
  open,
  onOpenChange,
  defaultGuestType = "Regular"
}) => {
  const { currentUser } = useUserRole();
  const form = useForm<SpotBookingFormData>({
    defaultValues: {
      guestName: "",
      contactNumber: "",
      email: "",
      sessionId: "",
      guestCount: 1,
      addons: [],
      paymentMethod: "cash",
      notes: "",
      bookingDate: new Date(),
      isPaid: false,
      transactionId: "",
      guestType: defaultGuestType,
    },
  });
  
  // Reset the form with the defaultGuestType when the modal opens
  useEffect(() => {
    if (open) {
      form.reset({
        ...form.getValues(),
        guestType: defaultGuestType
      });
    }
  }, [open, defaultGuestType, form]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Watch the isPaid field to conditionally show transaction ID field
  const isPaid = form.watch("isPaid");

  const handleSubmit = async (data: SpotBookingFormData) => {
    setIsSubmitting(true);
    try {
      // Generate a booking ID based on specifications
      const franchiseCode = currentUser?.franchiseId?.substring(0, 4) || "MAIN";
      const dateStr = format(new Date(), "yyyyMMdd");
      const randomIncrement = Math.floor(1000 + Math.random() * 9000);
      const bookingId = `SB-${dateStr}-${franchiseCode}-${randomIncrement}`;
      
      // Get the selected session name
      const selectedSession = mockSessions.find(s => s.id === data.sessionId);
      
      // Create a new booking object
      const newBooking = {
        id: bookingId,
        guestName: data.guestName,
        guestType: data.guestType,
        sessionName: selectedSession?.name || "Unknown Session",
        sessionId: data.sessionId,
        bookingDate: format(data.bookingDate, "yyyy-MM-dd"),
        createdAt: new Date().toISOString(),
        status: "confirmed" as const,
        paymentStatus: data.isPaid ? "paid" as const : "pending" as const,
        totalGuests: data.guestCount,
        specialRequests: data.notes,
        reminderStatus: "not_sent" as const,
        reminderCount: 0,
        contactDetails: {
          email: data.email,
          phone: data.contactNumber,
        },
        isNewBooking: true,
        createdVia: "spot_booking",
      };
      
      // Add the booking to the mock system
      mockBookingSystem.addBooking(newBooking);
      
      toast.success("Spot booking created successfully!", {
        description: `Booking ID: ${bookingId}`,
      });
      
      // Close the modal and reset form
      onOpenChange(false);
      form.reset();
      
    } catch (error) {
      console.error("Error creating spot booking:", error);
      toast.error("Failed to create spot booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" aria-hidden="true" />
            Spot Booking
          </DialogTitle>
          <DialogDescription>
            Create a manual booking entry for walk-in guests.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="guestName"
                rules={{ required: "Guest name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guest Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter guest name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter contact number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter guest email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sessionId"
                rules={{ required: "Session is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a session" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockSessions.map((session) => (
                          <SelectItem key={session.id} value={session.id}>
                            {session.name} ({session.remaining} spots left)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="guestCount"
                rules={{ 
                  required: "Guest count is required",
                  min: { value: 1, message: "Minimum 1 guest" }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Guests</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Input 
                          type="number" 
                          min={1} 
                          {...field} 
                          onChange={e => field.onChange(parseInt(e.target.value) || 1)}
                        />
                        <Users className="ml-2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bookingDate"
                rules={{ required: "Date is required" }}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="pl-3 text-left font-normal"
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="guestType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guest Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select guest type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Regular">Regular</SelectItem>
                        <SelectItem value="VIP">VIP</SelectItem>
                        <SelectItem value="First Timer">First Timer</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="wallet">Digital Wallet</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isPaid"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Mark as Paid</FormLabel>
                    <FormDescription>
                      Toggle if payment has been received
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {isPaid && (
              <FormField
                control={form.control}
                name="transactionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter transaction ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add any special requests or notes" 
                      className="resize-none" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" aria-hidden="true" />
                    Create Booking
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
