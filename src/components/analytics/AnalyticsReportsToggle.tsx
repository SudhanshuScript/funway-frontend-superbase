
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, FileText } from "lucide-react";
import { useUserRole } from "@/providers/UserRoleProvider";

interface AnalyticsReportsToggleProps {
  mainSection: "analytics" | "reports";
  setMainSection: (value: "analytics" | "reports") => void;
}

const AnalyticsReportsToggle: React.FC<AnalyticsReportsToggleProps> = ({
  mainSection,
  setMainSection
}) => {
  const { currentUser } = useUserRole();

  return (
    <Tabs value={mainSection} onValueChange={(value) => setMainSection(value as "analytics" | "reports")} className="w-auto">
      <TabsList className="bg-muted">
        {(currentUser?.role === "superadmin" || currentUser?.role === "franchise_owner") && (
          <TabsTrigger value="analytics" className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        )}
        <TabsTrigger value="reports" className="flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          Reports
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default AnalyticsReportsToggle;
