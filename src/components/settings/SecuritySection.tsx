
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface SecuritySectionProps {
  isAdmin: boolean;
}

const SecuritySection: React.FC<SecuritySectionProps> = ({ isAdmin }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Access Control Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Two-Factor Authentication</h3>
              <p className="text-sm text-muted-foreground">Require 2FA for all admin users</p>
            </div>
            <Switch id="security-2fa" />
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Session Timeout</h3>
              <p className="text-sm text-muted-foreground">Automatically log out after 30 minutes</p>
            </div>
            <Switch id="security-timeout" defaultChecked />
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">IP Restriction</h3>
              <p className="text-sm text-muted-foreground">Limit access to whitelisted IP addresses</p>
            </div>
            <Switch id="ip-restriction" />
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Device Management</h3>
              <p className="text-sm text-muted-foreground">Manage trusted devices for each user</p>
            </div>
            <Button variant="outline" size="sm">Manage</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Password Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Minimum Length</h3>
              <p className="text-sm text-muted-foreground">Require at least 8 characters</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Complexity Requirements</h3>
              <p className="text-sm text-muted-foreground">Require uppercase, lowercase, numbers, and symbols</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Password Expiry</h3>
              <p className="text-sm text-muted-foreground">Require password change every 90 days</p>
            </div>
            <Switch />
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Previous Password Restrictions</h3>
              <p className="text-sm text-muted-foreground">Prevent reuse of last 5 passwords</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Account Lockout</h3>
              <p className="text-sm text-muted-foreground">Lock account after 5 failed login attempts</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Security Alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-md bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-800 dark:text-amber-300">Multiple Failed Login Attempts</h3>
                <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                  3 failed login attempts detected for user manager@skybistro.com from IP 203.0.113.42
                </p>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline">Block IP</Button>
                  <Button size="sm" variant="outline">Lock Account</Button>
                  <Button size="sm" variant="ghost">Dismiss</Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 border rounded-md bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-800 dark:text-red-300">Unusual Access Pattern Detected</h3>
                <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                  User admin@skybistro.com logged in from an unusual location (New York, US) at 2023-05-19 23:15:22
                </p>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline">Review Activity</Button>
                  <Button size="sm" variant="outline">Force Logout</Button>
                  <Button size="sm" variant="ghost">Dismiss</Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isAdmin && (
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Role Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Superadmin</h3>
                <p className="text-sm text-muted-foreground">Full access to all system features</p>
              </div>
              <Button variant="outline" size="sm">Edit Permissions</Button>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Franchise Owner</h3>
                <p className="text-sm text-muted-foreground">Manage specific franchise operations</p>
              </div>
              <Button variant="outline" size="sm">Edit Permissions</Button>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Franchise Manager</h3>
                <p className="text-sm text-muted-foreground">Day-to-day franchise management</p>
              </div>
              <Button variant="outline" size="sm">Edit Permissions</Button>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Staff</h3>
                <p className="text-sm text-muted-foreground">Limited access to assigned duties</p>
              </div>
              <Button variant="outline" size="sm">Edit Permissions</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SecuritySection;
