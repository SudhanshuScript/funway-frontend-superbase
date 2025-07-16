
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserCheck, Calendar, GraduationCap, UserPlus, Clock3 } from "lucide-react";

interface StaffTabsNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const StaffTabsNav: React.FC<StaffTabsNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="grid grid-cols-6 w-full">
        <TabsTrigger value="all" className="text-sm">All Staff</TabsTrigger>
        <TabsTrigger value="on_duty" className="text-sm">
          <UserCheck className="h-4 w-4 mr-1" /> On Duty
        </TabsTrigger>
        <TabsTrigger value="on_leave" className="text-sm">
          <Calendar className="h-4 w-4 mr-1" /> On Leave
        </TabsTrigger>
        <TabsTrigger value="training" className="text-sm">
          <GraduationCap className="h-4 w-4 mr-1" /> In Training
        </TabsTrigger>
        <TabsTrigger value="new" className="text-sm">
          <UserPlus className="h-4 w-4 mr-1" /> Recently Joined
        </TabsTrigger>
        <TabsTrigger value="expired" className="text-sm">
          <Clock3 className="h-4 w-4 mr-1" /> Expired Compliance
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default StaffTabsNav;
