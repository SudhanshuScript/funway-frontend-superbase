
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface GuestPreference {
  id: number;
  preference: string;
  count: number;
  percentage: number;
}

interface PreferencesTabProps {
  guestPreferences: GuestPreference[];
}

export function PreferencesTab({ guestPreferences }: PreferencesTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Guest Dietary Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {guestPreferences.map((pref) => (
            <div key={pref.id} className="flex items-center">
              <div className="w-32 font-medium">{pref.preference}</div>
              <div className="flex-1">
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${pref.percentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-24 text-right">
                <span className="text-sm">{pref.count} guests</span>
              </div>
              <div className="w-16 text-right">
                <span className="text-sm font-medium">{pref.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
