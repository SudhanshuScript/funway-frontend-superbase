
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OfferData {
  name: string;
  rate: number;
  count: number;
  total: number;
}

interface OfferConversionRatesProps {
  offersData: OfferData[];
}

const OfferConversionRates: React.FC<OfferConversionRatesProps> = ({ offersData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Offer Conversion Rates</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <div className="space-y-6 p-4">
          {offersData.map((offer, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">
                  {offer.name} ({offer.rate}%)
                </span>
                <span className="text-sm font-medium">
                  {offer.count}/{offer.total}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${offer.rate}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OfferConversionRates;
