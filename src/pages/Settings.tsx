
import React, { useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useUserRole } from "@/providers/UserRoleProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import SettingsHeader from "@/components/settings/SettingsHeader";
import SettingsTabs from "@/components/settings/SettingsTabs";

const Settings = () => {
  const { currentUser } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else if (currentUser && !["superadmin", "franchise_owner"].includes(currentUser.role)) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  if (!currentUser || !["superadmin", "franchise_owner"].includes(currentUser.role)) {
    return null;
  }

  const handleGenerateSecurityReport = () => {
    toast.success("Security report is being generated and will be available shortly");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <SettingsHeader 
          isAdmin={currentUser.role === "superadmin"} 
          onGenerateReport={handleGenerateSecurityReport} 
        />
        
        <SettingsTabs currentUser={currentUser} />
      </div>
    </DashboardLayout>
  );
};

export default Settings;
