
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { MenuItemsWithSessions } from "@/components/dining/MenuItemsWithSessions";
import { DiningDashboard } from "@/components/dining/DiningDashboard";
import { UtensilsCrossed, LineChart, CalendarRange } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

const Dining = () => {
  // Show a toast for the demo to guide users about the data issue
  React.useEffect(() => {
    toast.info(
      "Demo mode: Using mock data for menu items",
      {
        duration: 5000,
      }
    );
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Dining Tabs */}
        <Tabs defaultValue="menu-items" className="w-full">
          <TabsList className="mb-6 bg-[#1A1F2C]/10 p-1 border border-[#2A2A2A]/20">
            <TabsTrigger value="menu-items" className="flex items-center gap-2 data-[state=active]:bg-[#7B61FF] data-[state=active]:text-white">
              <UtensilsCrossed className="h-4 w-4" />
              Menu Items
            </TabsTrigger>
            <TabsTrigger value="sessions" className="flex items-center gap-2 data-[state=active]:bg-[#7B61FF] data-[state=active]:text-white">
              <CalendarRange className="h-4 w-4" />
              Sessions
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-[#7B61FF] data-[state=active]:text-white">
              <LineChart className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="menu-items" className="mt-0 animate-fade-in">
            <MenuItemsWithSessions />
          </TabsContent>
          
          <TabsContent value="sessions" className="mt-0 animate-fade-in">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight">Dining Sessions</h2>
              <p className="text-sm text-muted-foreground">
                Manage your recurring dining sessions and their availability
              </p>
              
              {/* Placeholder for future sessions management feature */}
              <div className="p-8 rounded-lg border-2 border-dashed border-muted-foreground/20 text-center">
                <h3 className="text-lg font-medium mb-2">Sessions Management Coming Soon</h3>
                <p className="text-sm text-muted-foreground">
                  Enhanced sessions management features will be available in the next update.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="dashboard" className="mt-0 animate-fade-in">
            <DiningDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Dining;
