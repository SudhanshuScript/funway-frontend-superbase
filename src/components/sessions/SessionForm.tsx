
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addHours } from "date-fns";
import { CalendarIcon, InfoIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { SessionTypeSelector } from "./SessionTypeSelector";
import { DurationSelector } from "./DurationSelector";
import { SessionNameSelector } from "./SessionNameSelector";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define form schema with Zod
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  customName: z.string().optional(),
  eventType: z.string().default("regular"),
  startDate: z.date({
    required_error: "Please select a date",
  }),
  startTime: z.string().min(1, "Start time is required"),
  duration: z.string().or(z.number()).default("60"),
  maxCapacity: z.number().min(1, "Capacity must be at least 1"),
  price: z.number().min(0, "Price must be at least 0"),
  staff: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface SessionFormProps {
  onSubmit: (data: FormValues) => void;
  onCancel: () => void;
  initialData?: any;
  editMode?: boolean;
}

export function SessionForm({ onSubmit, onCancel, initialData, editMode = false }: SessionFormProps) {
  const [sessionType, setSessionType] = useState("regular");
  const [endTime, setEndTime] = useState<string>("");
  
  // Sample staff options (in a real app, these would come from the database)
  const staffOptions = [
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" },
    { id: "3", name: "Michael Johnson" },
    { id: "4", name: "Sarah Davis" },
  ];
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "Breakfast",
      customName: "",
      eventType: "regular",
      startDate: new Date(),
      startTime: "09:00",
      duration: "60",
      maxCapacity: 10,
      price: 149.99,
      staff: staffOptions[0].id,
      notes: "",
    },
  });

  // Initialize session type from initialData if available
  useEffect(() => {
    if (initialData?.eventType) {
      setSessionType(initialData.eventType);
    }
  }, [initialData]);
  
  // Handle session type change
  const handleSessionTypeChange = (value: string) => {
    setSessionType(value);
    form.setValue("eventType", value);
  };
  
  // Calculate end time based on start time and duration
  useEffect(() => {
    const startTimeValue = form.watch("startTime");
    const durationValue = form.watch("duration");
    
    if (startTimeValue) {
      try {
        // Parse start time
        const [hours, minutes] = startTimeValue.split(":").map(Number);
        const startDate = new Date();
        startDate.setHours(hours, minutes, 0, 0);
        
        // Add duration
        const durationMinutes = Number(durationValue);
        const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
        
        // Format end time
        const endHours = endDate.getHours().toString().padStart(2, "0");
        const endMinutes = endDate.getMinutes().toString().padStart(2, "0");
        setEndTime(`${endHours}:${endMinutes}`);
      } catch (error) {
        console.error("Error calculating end time:", error);
        setEndTime("");
      }
    }
  }, [form.watch("startTime"), form.watch("duration")]);
  
  // Handle form submission
  const handleSubmit = async (data: FormValues) => {
    const formattedData = {
      ...data,
      // Handle custom name
      name: data.name === "Add Custom Name" ? data.customName : data.name,
      // Convert duration to number
      duration: Number(data.duration),
      // Calculate end time
      endTime: endTime,
      // Find the staff name based on the selected ID
      staff: staffOptions.find(staff => staff.id === data.staff)?.name || "Unassigned",
    };
    
    await onSubmit(formattedData);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="bg-muted/50 p-4 rounded-lg border mb-6">
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Session Information</AlertTitle>
            <AlertDescription>
              {editMode 
                ? "Edit the session details below. All fields marked with * are required."
                : "Create a new session by filling out this form. All fields marked with * are required."}
            </AlertDescription>
          </Alert>
        </div>
        
        <SessionTypeSelector form={form} onTypeChange={handleSessionTypeChange} />
        
        <SessionNameSelector form={form} sessionType={sessionType} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="flex items-center">
                  Date *
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
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
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time *</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormItem>
              <FormLabel>End Time</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  value={endTime}
                  disabled
                  className="bg-muted/50"
                />
              </FormControl>
              <FormDescription>Auto-calculated based on duration</FormDescription>
            </FormItem>
          </div>
          
          <DurationSelector form={form} />
          
          <FormField
            control={form.control}
            name="maxCapacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">Guest Capacity *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Price per Person ($) *
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-4 w-4 ml-1 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-[200px]">This is the base price per person for this session. Addons and special options can be configured separately.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="relative"
                    placeholder="0.00"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="staff"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assign Staff</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select staff" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {staffOptions.map((staff) => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Staff member who will manage this session</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <textarea 
                  className="w-full p-2 border rounded-md resize-y min-h-[100px]"
                  rows={4}
                  {...field}
                  placeholder="Add any additional notes about this session (special instructions, requirements, etc.)"
                />
              </FormControl>
              <FormDescription>These notes will be visible to staff members only.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Separator />
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-primary">
            {editMode ? "Update" : "Create"} Session
          </Button>
        </div>
      </form>
    </Form>
  );
}
