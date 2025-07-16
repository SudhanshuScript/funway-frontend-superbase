
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface DiscountBadgeProps {
  type: string;
  value: number;
}

const DiscountBadge = ({ type, value }: DiscountBadgeProps) => {
  if (type === 'Percentage') {
    return (
      <Badge variant="outline" className="border-green-500 text-green-500 font-medium">
        {value}%
      </Badge>
    );
  } else if (type === 'Fixed Amount') {
    return (
      <Badge variant="outline" className="border-blue-500 text-blue-500 font-medium">
        ₹{value}
      </Badge>
    );
  } else if (type === 'Free Add-On') {
    return (
      <Badge variant="outline" className="border-purple-500 text-purple-500 font-medium">
        🎁 Free Add-On
      </Badge>
    );
  } else {
    return (
      <Badge variant="outline" className="border-amber-500 text-amber-500 font-medium">
        {type}: {value}
      </Badge>
    );
  }
};

export default DiscountBadge;
