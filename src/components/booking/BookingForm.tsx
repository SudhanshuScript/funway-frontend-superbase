import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { 
  Calendar, 
  CalendarIcon, 
  Check, 
  ChevronsUpDown, 
  Users, 
  Phone, 
  Mail, 
  MessageSquare
} from "lucide-react";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useAuditLogger } from "@/utils/auditLogger";
import { useUserRole } from "@/providers/UserRoleProvider";

const sessionTypes = [
  { label: "Breakfast", value: "breakfast" },
  { label: "Brunch", value: "brunch" },
  { label: "Lunch", value: "lunch" },
  { label: "Dinner", value: "dinner" },
  { label: "Aurora Flight", value: "aurora" },
  { label: "Twilight Flight", value: "twilight" },
];

const offerCodes = [
  { label: "None", value: "none" },
  { label: "WELCOME10", value: "WELCOME10" },
  { label: "SUMMER25", value: "SUMMER25" },
  { label: "LOYALTY15", value: "LOYALTY15" },
  { label: "BIRTHDAY20", value: "BIRTHDAY20" },
];

const formSchema = z.object({
  guestName: z.string().min(2, "Name must be at least 2 characters."),
  contactNumber: z.string().min(7, "Valid phone number required."),
  email: z.string().email("Valid email required."),
  numberOfGuests: z.number().min(1).max(20, "Maximum 20 guests allowed."),
  experienceDate: z.date({
    required_error: "Please select a date.",
  }),
  sessionType: z.string({
    required_error: "Please select a session type.",
  }),
  specialRequests: z.string().optional(),
  paymentStatus: z.string({
    required_error: "Please select payment status.",
  }),
  offerCode: z.string().default("none"),
  bookingStatus: z.string().default("Confirmed"),
  customerType: z.string().default("First-Time"),
});

export type BookingFormValues = z.infer<typeof formSchema>;

interface BookingFormProps {
  initialValues?: BookingFormValues;
  onSubmit: (values: BookingFormValues) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export function BookingForm({
  initialValues,
  onSubmit,
  onCancel,
  isEditing = false
}: BookingFormProps) {
  const { currentUser } = useUserRole();
  const { logEvent } = useAuditLogger();
  
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      guestName: initialValues?.guestName || "",
      contactNumber: initialValues?.contactNumber || "",
      email: initialValues?.email || "",
      numberOfGuests: initialValues?.numberOfGuests || 2,
      experienceDate: initialValues?.experienceDate || new Date(),
      sessionType: initialValues?.sessionType || "dinner",
      specialRequests: initialValues?.specialRequests || "",
      paymentStatus: initialValues?.paymentStatus || "Unpaid",
      offerCode: initialValues?.offerCode || "none",
      bookingStatus: initialValues?.bookingStatus || "Confirmed",
      customerType: initialValues?.customerType || "First-Time",
    },
  });

  const handleSubmit = async (values: BookingFormValues) => {
    try {
      console.log("Form values being submitted:", values);
      
      onSubmit(values);
      
      logEvent(
        'booking',
        'new-booking',
        isEditing ? 'update' : 'create',
        { bookingDetails: values }
      );
      
      toast.success(
        isEditing ? "Booking updated successfully!" : "Booking created successfully!"
      );
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast.error("Failed to save booking. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Guest Information</h3>
            
            <FormField
              control={form.control}
              name="guestName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Guest Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Smith" {...field} />
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
                    <div className="relative">
                      <Phone className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="+1 (555) 123-4567" className="pl-8" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="guest@example.com" className="pl-8" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="numberOfGuests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Guests</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Users className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="number" 
                        min={1} 
                        max={20} 
                        className="pl-8" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        value={field.value}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="customerType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="First-Time">First-Time ⭐</SelectItem>
                      <SelectItem value="Repeat">Repeat 🌟</SelectItem>
                      <SelectItem value="VIP">VIP 💎</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Booking Information</h3>
            
            <FormField
              control={form.control}
              name="experienceDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Experience Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
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
                      <CalendarComponent
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        disabled={(date) => date < new Date()}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="sessionType"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Session Type</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? sessionTypes.find(
                                (session) => session.value === field.value
                              )?.label
                            : "Select session type"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search session types..." />
                        <CommandEmpty>No session type found.</CommandEmpty>
                        <CommandGroup>
                          {sessionTypes.map((session) => (
                            <CommandItem
                              key={session.value}
                              value={session.value}
                              onSelect={() => {
                                form.setValue("sessionType", session.value);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  session.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {session.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="offerCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Offer/Voucher Code</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select offer code" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {offerCodes.map((offer) => (
                        <SelectItem key={offer.value} value={offer.value}>
                          {offer.label}
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
              name="paymentStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Status</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Unpaid">Unpaid</SelectItem>
                      <SelectItem value="Partially Paid">Partially Paid</SelectItem>
                      <SelectItem value="Refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="bookingStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Booking Status</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select booking status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Confirmed">Confirmed</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Canceled">Canceled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="specialRequests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Requests</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MessageSquare className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Textarea 
                        placeholder="Any special requests or notes..." 
                        className="min-h-32 pl-8"
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? "Update Booking" : "Create Booking"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
