
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingForm } from "@/components/booking/BookingForm";
import { BookingQueries } from "@/components/booking/BookingQueries";
import { UpcomingBookingsManager } from "@/components/booking/UpcomingBookingsManager";
import { OngoingBookingsManager } from "@/components/booking/OngoingBookingsManager";
import { AbandonedCartManager } from "@/components/cart/AbandonedCartManager";
import { Button } from "@/components/ui/button";
import { Calendar, FilterX } from "lucide-react";
import { toast } from "sonner";
import { useAuditLogger } from "@/utils/auditLogger";
import { Badge } from "@/components/ui/badge";

interface BookingTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function BookingTabs({ activeTab, setActiveTab }: BookingTabsProps) {
  const { logEvent } = useAuditLogger();
  
  // Mock counts for tabs
  const tabCounts = {
    upcoming: 24,
    ongoing: 8,
    past: 152,
    abandoned: 17,
    recovered: 9,
    create: 0
  };
  
  const handleFormSubmit = (values: any) => {
    console.log("Form values:", values);
    toast.success("Booking created successfully!");
    setTimeout(() => setActiveTab("upcoming"), 1500);
  };

  return (
    <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <TabsList className="mb-4 sm:mb-0 rounded-full p-1 gap-2 bg-gyro-dark/80 border border-gyro-border shadow-lg shadow-black/10 backdrop-blur-md">
          <TabsTrigger 
            value="upcoming" 
            className="gyro-tab"
          >
            Upcoming
            <Badge className="ml-2 bg-gyro-dark/80 border-gyro-border text-gray-300">{tabCounts.upcoming}</Badge>
          </TabsTrigger>
          <TabsTrigger 
            value="ongoing"
            className="gyro-tab"
          >
            Ongoing
            <Badge className="ml-2 bg-gyro-dark/80 border-gyro-border text-gray-300">{tabCounts.ongoing}</Badge>
          </TabsTrigger>
          <TabsTrigger 
            value="past"
            className="gyro-tab"
          >
            Past
            <Badge className="ml-2 bg-gyro-dark/80 border-gyro-border text-gray-300">{tabCounts.past}</Badge>
          </TabsTrigger>
          <TabsTrigger 
            value="abandoned"
            className="gyro-tab"
          >
            Abandoned
            <Badge className="ml-2 bg-gyro-dark/80 border-gyro-border text-gray-300">{tabCounts.abandoned}</Badge>
          </TabsTrigger>
          <TabsTrigger 
            value="recovered"
            className="gyro-tab"
          >
            Recovered
            <Badge className="ml-2 bg-gyro-dark/80 border-gyro-border text-gray-300">{tabCounts.recovered}</Badge>
          </TabsTrigger>
          <TabsTrigger 
            value="create"
            className="gyro-tab"
          >
            Create Booking
          </TabsTrigger>
        </TabsList>
        
        <div className="flex items-center gap-2">
          <Card className="flex items-center bg-gyro-card border-gyro-border shadow-sm">
            <Button variant="ghost" size="sm" className="rounded-l-lg rounded-r-none text-gray-300 hover:text-white">
              <Calendar className="h-4 w-4 mr-1 text-spotBooking" /> Filter by Date
            </Button>
            <div className="h-6 w-px bg-gyro-border"></div>
            <Button variant="ghost" size="sm" className="rounded-r-lg rounded-l-none text-gray-300 hover:text-white">
              <FilterX className="h-4 w-4 mr-1 text-spotBooking" /> Clear Filters
            </Button>
          </Card>
        </div>
      </div>
      
      <TabsContent value="upcoming" className="pt-2 animate-fade-in">
        <UpcomingBookingsManager />
      </TabsContent>
      
      <TabsContent value="ongoing" className="pt-2 animate-fade-in">
        <OngoingBookingsManager />
      </TabsContent>
      
      <TabsContent value="past" className="pt-2 animate-fade-in">
        <Card className="gyro-card border-gyro-border">
          <CardHeader>
            <CardTitle className="text-xl uppercase tracking-wide bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Past Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <BookingQueries bookingType="Past" />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="abandoned" className="pt-2 animate-fade-in">
        <AbandonedCartManager />
      </TabsContent>
      
      <TabsContent value="recovered" className="pt-2 animate-fade-in">
        <Card className="gyro-card border-gyro-border">
          <CardHeader>
            <CardTitle className="text-xl uppercase tracking-wide bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Recovered Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <BookingQueries bookingType="Recovered" />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="create" className="pt-2 animate-fade-in">
        <Card className="gyro-card border-gyro-border">
          <CardHeader>
            <CardTitle className="text-xl uppercase tracking-wide bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Create New Booking</CardTitle>
          </CardHeader>
          <CardContent>
            <BookingForm 
              onSubmit={handleFormSubmit} 
              onCancel={() => setActiveTab("upcoming")}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
