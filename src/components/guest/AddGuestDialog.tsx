
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Heart } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { GuestType } from "@/types/guestTypes";

// Common preferences for guests
const availablePreferences = [
  "Window Seat", 
  "Vegetarian", 
  "Birthday Package", 
  "Evening Sessions", 
  "Special Assistance",
  "Celebration Package",
  "Kids Menu",
  "Allergen Information",
  "Photography Package"
];

interface AddGuestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddGuest: (guestData: any) => void;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
  guestType: z.string(),
  franchiseId: z.string(),
  preferences: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export function AddGuestDialog({ 
  open, 
  onOpenChange, 
  onAddGuest
}: AddGuestDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      guestType: "New",
      franchiseId: "franchise-1",
      preferences: [],
      notes: "",
    },
  });
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Check for existing guest with same email or phone
    const isDuplicate = false; // This would check against your database
    
    if (isDuplicate) {
      toast.error("A guest with this email or phone already exists!", {
        description: "Please check your records before adding a duplicate."
      });
      return;
    }
    
    console.log("Adding new guest:", values);
    
    onAddGuest(values);
    toast.success("Guest added successfully!");
    
    form.reset();
    onOpenChange(false);
  };
  
  const togglePreference = (preference: string) => {
    const currentPreferences = form.getValues("preferences") || [];
    const newPreferences = currentPreferences.includes(preference)
      ? currentPreferences.filter(p => p !== preference)
      : [...currentPreferences, preference];
    
    form.setValue("preferences", newPreferences);
  };
  
  const selectedPreferences = form.watch("preferences") || [];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Guest</DialogTitle>
          <DialogDescription>
            Add a new guest to the CRM database
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="guest@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="guestType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guest Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select guest type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Regular">Regular</SelectItem>
                        <SelectItem value="VIP">VIP</SelectItem>
                        <SelectItem value="High Potential">High Potential</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Normally auto-assigned, but can be manually set
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="franchiseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Franchise</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select franchise" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="franchise-1">Downtown FlyDining</SelectItem>
                        <SelectItem value="franchise-2">Riverside Experience</SelectItem>
                        <SelectItem value="franchise-3">Mountain View</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormItem>
              <FormLabel className="flex items-center">
                <Heart className="h-4 w-4 mr-2" /> Guest Preferences
              </FormLabel>
              <div className="flex flex-wrap gap-2 mt-2">
                {availablePreferences.map((pref) => (
                  <Badge
                    key={pref}
                    variant={selectedPreferences.includes(pref) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => togglePreference(pref)}
                  >
                    {selectedPreferences.includes(pref) ? pref : `+ ${pref}`}
                  </Badge>
                ))}
              </div>
            </FormItem>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Input placeholder="Any additional notes about this guest" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Guest
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
