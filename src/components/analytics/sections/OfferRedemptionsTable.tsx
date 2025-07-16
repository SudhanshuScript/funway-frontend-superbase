
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OfferRedemption {
  name: string;
  date: string;
  guest: string;
  discount: string;
  amount: string;
}

interface OfferRedemptionsTableProps {
  redemptions: OfferRedemption[];
}

const OfferRedemptionsTable: React.FC<OfferRedemptionsTableProps> = ({ redemptions }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Offer Redemptions</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Offer Name</th>
              <th className="text-left py-2">Redemption Date</th>
              <th className="text-left py-2">Guest</th>
              <th className="text-right py-2">Discount</th>
              <th className="text-right py-2">Final Amount</th>
            </tr>
          </thead>
          <tbody>
            {redemptions.map((redemption, index) => (
              <tr key={index} className={index < redemptions.length - 1 ? "border-b" : ""}>
                <td className="py-2">{redemption.name}</td>
                <td>{redemption.date}</td>
                <td>{redemption.guest}</td>
                <td className="text-right">{redemption.discount}</td>
                <td className="text-right">{redemption.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

export default OfferRedemptionsTable;
