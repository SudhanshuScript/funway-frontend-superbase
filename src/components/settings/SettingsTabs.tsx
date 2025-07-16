
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Key,
  Shield,
  Bell,
  Globe,
  History
} from "lucide-react";
import ProfileSection from "./ProfileSection";
import AccountSection from "./AccountSection";
import SecuritySection from "./SecuritySection";
import NotificationsSection from "./NotificationsSection";
import GlobalSettingsContent from "./GlobalSettingsContent";
import AuditLogsSection from "./AuditLogsSection";

interface SettingsTabsProps {
  currentUser: {
    name: string;
    email: string;
    role: string;
  };
  defaultTab?: string;
}

const SettingsTabs: React.FC<SettingsTabsProps> = ({ currentUser, defaultTab = "profile" }) => {
  const isAdmin = currentUser.role === "superadmin";

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="grid w-full grid-cols-6 lg:w-[800px]">
        <TabsTrigger value="profile" className="flex items-center">
          <User className="h-4 w-4 mr-2" />
          Profile
        </TabsTrigger>
        <TabsTrigger value="account" className="flex items-center">
          <Key className="h-4 w-4 mr-2" />
          Account
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center">
          <Shield className="h-4 w-4 mr-2" />
          Security
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex items-center">
          <Bell className="h-4 w-4 mr-2" />
          Notifications
        </TabsTrigger>
        {isAdmin && (
          <TabsTrigger value="global-settings" className="flex items-center">
            <Globe className="h-4 w-4 mr-2" />
            Global Settings
          </TabsTrigger>
        )}
        {isAdmin && (
          <TabsTrigger value="audit-logs" className="flex items-center">
            <History className="h-4 w-4 mr-2" />
            Audit Logs
          </TabsTrigger>
        )}
      </TabsList>
      
      <TabsContent value="profile" className="mt-6">
        <ProfileSection currentUser={currentUser} />
      </TabsContent>
      
      <TabsContent value="account" className="mt-6">
        <AccountSection />
      </TabsContent>
      
      <TabsContent value="security" className="mt-6">
        <SecuritySection isAdmin={isAdmin} />
      </TabsContent>
      
      <TabsContent value="notifications" className="mt-6">
        <NotificationsSection />
      </TabsContent>
      
      {isAdmin && (
        <TabsContent value="global-settings" className="mt-6">
          <GlobalSettingsContent />
        </TabsContent>
      )}

      {isAdmin && (
        <TabsContent value="audit-logs" className="mt-6">
          <AuditLogsSection />
        </TabsContent>
      )}
    </Tabs>
  );
};

export default SettingsTabs;
