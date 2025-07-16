
import React from "react";
import { useFormContext } from "react-hook-form";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { BookingFormValues } from "../../MultiStepBookingFormTypes";
import { AddonPackage } from "./AddonPackageSelector";

interface BookingSummaryProps {
  addonPackages: AddonPackage[];
}

export function BookingSummary({ addonPackages }: BookingSummaryProps) {
  const { watch } = useFormContext<BookingFormValues>();
  
  const bookingDate = watch("bookingDate");
  const bookingTime = watch("bookingTime");
  const addonPackage = watch("addonPackage");
  
  return (
    <Card className="bg-muted/30 border mt-6">
      <CardContent className="p-4">
        <h3 className="font-medium mb-2">Booking Summary</h3>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">Date:</div>
            <div>{bookingDate ? format(new Date(bookingDate), "EEEE, MMMM d, yyyy") : "Not selected"}</div>
            
            <div className="text-muted-foreground">Time:</div>
            <div>{bookingTime || "Not selected"}</div>
            
            <div className="text-muted-foreground">Session:</div>
            <div>
              {watch("customSessionName") || watch("sessionName") || "Not selected"}
            </div>
            
            {addonPackage && addonPackage !== "none" && (
              <>
                <div className="text-muted-foreground">Add-on:</div>
                <div>{addonPackages.find(a => a.id === addonPackage)?.name || "None"}</div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
