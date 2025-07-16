
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RepeatGuestRateCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Repeat Guest Rate</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <div className="flex h-full flex-col items-center justify-center">
          <div className="text-5xl font-bold">68%</div>
          <p className="text-sm text-muted-foreground mt-2">
            of guests return within 3 months
          </p>
          <div className="w-full mt-8 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">First-time guests</span>
              <span className="text-sm font-medium">32%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div
                className="bg-red-600 h-2.5 rounded-full"
                style={{ width: "32%" }}
              ></div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <span className="text-sm">Returning guests</span>
              <span className="text-sm font-medium">68%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div
                className="bg-green-600 h-2.5 rounded-full"
                style={{ width: "68%" }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RepeatGuestRateCard;
