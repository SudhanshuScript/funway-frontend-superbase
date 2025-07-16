
import React from "react";
import { Star } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface OfferRedeemedFilterProps {
  offerRedeemed: boolean | null;
  onOfferRedeemedChange: (value: string) => void;
}

const OfferRedeemedFilter: React.FC<OfferRedeemedFilterProps> = ({
  offerRedeemed,
  onOfferRedeemedChange,
}) => {
  return (
    <div className="space-y-2">
      <h4 className="font-medium flex items-center">
        <Star className="h-4 w-4 mr-2" /> Offer Redeemed
      </h4>
      <div className="flex gap-4 mt-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="offer-yes"
            checked={offerRedeemed === true}
            onCheckedChange={() => onOfferRedeemedChange(offerRedeemed === true ? "all" : "yes")}
          />
          <Label htmlFor="offer-yes">Yes</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="offer-no"
            checked={offerRedeemed === false}
            onCheckedChange={() => onOfferRedeemedChange(offerRedeemed === false ? "all" : "no")}
          />
          <Label htmlFor="offer-no">No</Label>
        </div>
      </div>
    </div>
  );
};

export default OfferRedeemedFilter;
