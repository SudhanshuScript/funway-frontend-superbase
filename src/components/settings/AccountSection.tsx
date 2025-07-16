
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

const AccountSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>Manage your account settings and preferences.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="marketing">Marketing Emails</Label>
              <p className="text-sm text-muted-foreground">Receive emails about promotions and updates.</p>
            </div>
            <Switch id="marketing" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="2fa">Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
            </div>
            <Switch id="2fa" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="session-timeout">Session Timeout</Label>
              <p className="text-sm text-muted-foreground">Automatically log out after 30 minutes.</p>
            </div>
            <Switch id="session-timeout" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="data-sharing">Data Sharing</Label>
              <p className="text-sm text-muted-foreground">Allow anonymous usage data to be shared.</p>
            </div>
            <Switch id="data-sharing" defaultChecked />
          </div>
        </div>
        <div className="pt-4 border-t border-border">
          <Button variant="destructive">Delete Account</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountSection;
