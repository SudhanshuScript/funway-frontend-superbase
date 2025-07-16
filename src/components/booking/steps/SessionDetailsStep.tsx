
import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingFormValues } from "../MultiStepBookingFormTypes";

// Import session data and component types
import { sessionData, addonPackages, featuredSessions } from "./session-details/sessionTypes";

// Import sub-components
import { FeaturedSessionTab } from "./session-details/FeaturedSessionTab";
import { CustomSessionTab } from "./session-details/CustomSessionTab";
import { AddonPackageSelector } from "./session-details/AddonPackageSelector";
import { BookingSummary } from "./session-details/BookingSummary";

export function SessionDetailsStep() {
  const { setValue, watch } = useFormContext<BookingFormValues>();
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("featured");
  
  const experienceDate = watch("experienceDate");
  const sessionType = watch("sessionType");
  const bookingTime = watch("bookingTime");
  
  useEffect(() => {
    if (sessionType && sessionData[sessionType as keyof typeof sessionData]) {
      const session = sessionData[sessionType as keyof typeof sessionData];
      
      setValue("sessionName", session.name);
      
      setTimeSlots(session.timeSlots);
      
      if (!bookingTime || !timeSlots.includes(bookingTime)) {
        setValue("bookingTime", session.timeSlots[0]);
      }
    }
  }, [sessionType, setValue, bookingTime, timeSlots]);
  
  useEffect(() => {
    if (experienceDate) {
      setValue("bookingDate", format(experienceDate, "yyyy-MM-dd"));
    }
  }, [experienceDate, setValue]);
  
  const handleSelectFeaturedSession = (featuredSession: typeof featuredSessions[0]) => {
    setValue("experienceDate", featuredSession.date);
    setValue("sessionType", featuredSession.session);
    setValue("bookingDate", format(featuredSession.date, "yyyy-MM-dd"));
    setValue("bookingTime", featuredSession.time);
    
    const session = sessionData[featuredSession.session as keyof typeof sessionData];
    if (session) {
      setValue("sessionName", session.name);
    }
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-4">
          <TabsTrigger value="featured">Featured Sessions</TabsTrigger>
          <TabsTrigger value="custom">Custom Selection</TabsTrigger>
        </TabsList>
        
        <TabsContent value="featured" className="mt-2">
          <FeaturedSessionTab 
            featuredSessions={featuredSessions}
            sessionData={sessionData}
            onSelectFeaturedSession={handleSelectFeaturedSession}
          />
        </TabsContent>
        
        <TabsContent value="custom" className="mt-2 relative">
          <CustomSessionTab 
            sessionData={sessionData}
            timeSlots={timeSlots}
          />
        </TabsContent>
      </Tabs>
      
      <Separator className="my-6" />
      
      <AddonPackageSelector addonPackages={addonPackages} />
      
      <BookingSummary addonPackages={addonPackages} />
    </div>
  );
}
