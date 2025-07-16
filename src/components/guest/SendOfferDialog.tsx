
import React, { useState } from 'react';
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
import { Calendar } from "@/components/ui/calendar";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar as CalendarIcon, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Guest } from "@/types/guestTypes";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Mock offers data
const availableOffers = [
  { id: "offer1", name: "Birthday Special - 20% Off" },
  { id: "offer2", name: "Loyalty Discount - Free Dessert" },
  { id: "offer3", name: "Anniversary Package" },
  { id: "offer4", name: "Weekday Special - 15% Off" },
  { id: "offer5", name: "Family Package - Kids Eat Free" }
];

interface SendOfferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guest: Guest | null;
  selectedGuests: Guest[];
}

const formSchema = z.object({
  offerId: z.string({
    required_error: "Please select an offer to send",
  }),
  channel: z.string({
    required_error: "Please select a delivery channel",
  }),
  scheduledDate: z.date().optional(),
  sendMethod: z.enum(["now", "scheduled"]),
});

export function SendOfferDialog({ 
  open, 
  onOpenChange, 
  guest,
  selectedGuests
}: SendOfferDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sendMethod: "now",
      channel: "email",
    },
  });
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const targetGuests = guest ? [guest] : selectedGuests;
    const guestCount = targetGuests.length;
    
    // Here you would send the offer to the selected guest(s)
    console.log("Sending offer:", values);
    console.log("To guests:", targetGuests.map(g => g.name));
    
    toast.success(
      `Offer sent successfully to ${guestCount} ${guestCount === 1 ? 'guest' : 'guests'}!`, 
      { description: values.sendMethod === "scheduled" ? `Scheduled for ${format(values.scheduledDate!, "PPP")}` : "Delivered immediately" }
    );
    
    form.reset();
    onOpenChange(false);
  };
  
  const targetCount = guest ? 1 : selectedGuests.length;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Send Offer</DialogTitle>
          <DialogDescription>
            {guest 
              ? `Send a personalized offer to ${guest.name}`
              : `Send an offer to ${targetCount} selected guests`
            }
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="offerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Offer</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an offer to send" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableOffers.map(offer => (
                        <SelectItem key={offer.id} value={offer.id}>
                          {offer.name}
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
              name="channel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Channel</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select delivery channel" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="telegram">Telegram</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="sendMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>When to Send</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select when to send" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="now">Send Now</SelectItem>
                      <SelectItem value="scheduled">Schedule for Later</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {form.watch("sendMethod") === "scheduled" && (
              <FormField
                control={form.control}
                name="scheduledDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Schedule Date</FormLabel>
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
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <Send className="h-4 w-4 mr-2" />
                {form.watch("sendMethod") === "now" ? "Send Now" : "Schedule"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
