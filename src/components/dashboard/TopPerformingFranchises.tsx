
import React from "react";
import { Building, TrendingUp, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FranchiseData {
  id: string;
  name: string;
  city: string;
  revenue: number;
  occupancy: number;
}

interface TopPerformingFranchisesProps {
  franchises?: FranchiseData[];
  loading?: boolean;
}

// Sample data for top performing franchises
const sampleFranchises = [
  { id: "fr-001", name: "FlyDining Goa", city: "Goa", revenue: 43000, occupancy: 85 },
  { id: "fr-002", name: "SkyBistro Mumbai", city: "Mumbai", revenue: 38500, occupancy: 78 },
  { id: "fr-003", name: "Cloud Cuisine Delhi", city: "Delhi", revenue: 32000, occupancy: 72 },
  { id: "fr-004", name: "Aerial Eats Bangalore", city: "Bangalore", revenue: 29000, occupancy: 69 },
];

export const TopPerformingFranchises: React.FC<TopPerformingFranchisesProps> = ({
  franchises = sampleFranchises,
  loading = false
}) => {
  return (
    <Card className="shadow-sm border h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>Top Performing Franchises Today</span>
          <Building className="h-4 w-4 text-muted-foreground" aria-label="Franchises" />
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="h-[150px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-3 mt-2">
            {franchises.map((franchise, index) => (
              <div key={franchise.id} className="flex flex-col space-y-1">
                <div className="flex justify-between items-center">
                  <div className="font-medium flex items-center">
                    <span className="text-primary">{franchise.name}</span>
                  </div>
                  <div className="text-sm font-semibold">
                    ₹{franchise.revenue.toLocaleString()}
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" aria-label="Location" />
                    {franchise.city}
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" aria-label="Occupancy" />
                    <span className={franchise.occupancy >= 80 ? "text-green-500" : franchise.occupancy >= 70 ? "text-amber-500" : "text-red-500"}>
                      {franchise.occupancy}% occupancy
                    </span>
                  </div>
                </div>
                {index < franchises.length - 1 && (
                  <div className="border-b border-border mt-2"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
