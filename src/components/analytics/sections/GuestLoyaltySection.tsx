
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GuestLoyaltySection: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Guest Loyalty Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">VIP Guests</h4>
              <p className="text-sm text-muted-foreground">5+ visits in last 3 months</p>
            </div>
            <div className="text-xl font-bold">48</div>
          </div>
          
          <div className="flex justify-between items-center p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Regular Guests</h4>
              <p className="text-sm text-muted-foreground">2-4 visits in last 3 months</p>
            </div>
            <div className="text-xl font-bold">125</div>
          </div>
          
          <div className="flex justify-between items-center p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Occasional Guests</h4>
              <p className="text-sm text-muted-foreground">1 visit in last 3 months</p>
            </div>
            <div className="text-xl font-bold">82</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GuestLoyaltySection;
