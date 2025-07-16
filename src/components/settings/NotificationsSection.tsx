
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

const NotificationsSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Choose how you want to be notified.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email_notif">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive notifications via email.</p>
            </div>
            <Switch id="email_notif" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sms_notif">SMS Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive notifications via SMS.</p>
            </div>
            <Switch id="sms_notif" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push_notif">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive push notifications on your devices.</p>
            </div>
            <Switch id="push_notif" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="security_alerts">Security Alerts</Label>
              <p className="text-sm text-muted-foreground">Receive alerts about suspicious activity.</p>
            </div>
            <Switch id="security_alerts" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="booking_notif">Booking Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive notifications about new bookings.</p>
            </div>
            <Switch id="booking_notif" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="system_updates">System Updates</Label>
              <p className="text-sm text-muted-foreground">Receive notifications about platform updates.</p>
            </div>
            <Switch id="system_updates" defaultChecked />
          </div>
        </div>
        <Button>Save Preferences</Button>
      </CardContent>
    </Card>
  );
};

export default NotificationsSection;
