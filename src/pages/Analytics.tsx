
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { BarChart3, FileText } from "lucide-react";
import { useUserRole } from "@/providers/UserRoleProvider";
import { useNavigate } from "react-router-dom";
import AnalyticsReportsToggle from "@/components/analytics/AnalyticsReportsToggle";
import AnalyticsSection from "@/components/analytics/AnalyticsSection";
import ReportsSection from "@/components/analytics/ReportsSection";
import { BreadcrumbNav } from "@/components/navigation/BreadcrumbNav";

const Analytics = () => {
  const { currentUser } = useUserRole();
  const navigate = useNavigate();
  const [mainSection, setMainSection] = useState<"analytics" | "reports">("analytics");

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else if (currentUser && !["superadmin", "franchise_owner"].includes(currentUser.role) && mainSection === "analytics") {
      setMainSection("reports");
    }
  }, [currentUser, navigate, mainSection]);

  if (!currentUser) {
    return null;
  }
  
  const extraBreadcrumbItems = [
    { 
      label: mainSection === "analytics" ? "Analytics Dashboard" : "Reports Dashboard", 
      path: `/analytics/${mainSection}`, 
      isActive: true 
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {mainSection === "analytics" ? (
              <BarChart3 className="h-6 w-6 mr-2" />
            ) : (
              <FileText className="h-6 w-6 mr-2" />
            )}
            <h2 className="text-2xl font-bold">
              {mainSection === "analytics" ? "Analytics Dashboard" : "Reports Dashboard"}
            </h2>
          </div>
          <AnalyticsReportsToggle mainSection={mainSection} setMainSection={setMainSection} />
        </div>
        
        {/* Reports Section */}
        {mainSection === "reports" && <ReportsSection />}
        
        {/* Analytics Section */}
        {mainSection === "analytics" && 
          (currentUser.role === "superadmin" || currentUser.role === "franchise_owner") && 
          <AnalyticsSection />
        }
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
