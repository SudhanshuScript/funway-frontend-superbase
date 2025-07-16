
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface PreferencesTabContentProps {
  preferences: any[];
}

export function PreferencesTabContent({ preferences }: PreferencesTabContentProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Guest Preferences</h2>
      </div>
      
      <Card className="border-[#2A2A2A] shadow-md">
        <CardHeader className="bg-[#1A1F2C]/30 border-b border-[#2A2A2A]">
          <CardTitle>Dietary Preferences</CardTitle>
          <CardDescription>
            Track and analyze guest dietary preferences to optimize your menu offerings
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {preferences.map((pref) => (
            <div key={pref.id} className="mb-4 last:mb-0">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{pref.preference}</span>
                <span className="text-sm text-muted-foreground">
                  {pref.count} guests ({pref.percentage}%)
                </span>
              </div>
              <Progress value={pref.percentage} className="h-2" />
            </div>
          ))}
          
          <div className="mt-8 p-4 border border-dashed rounded-md bg-muted/10">
            <p className="text-center text-muted-foreground">
              More detailed analytics and preference management features coming soon
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
