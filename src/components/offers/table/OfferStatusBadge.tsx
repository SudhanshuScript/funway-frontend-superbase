
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface OfferStatusBadgeProps {
  status: string;
}

const OfferStatusBadge = ({ status }: OfferStatusBadgeProps) => {
  switch (status) {
    case 'Active':
      return <Badge className="bg-green-500">Active</Badge>;
    case 'Scheduled':
      return <Badge variant="outline" className="border-blue-500 text-blue-500">Scheduled</Badge>;
    case 'Draft':
      return <Badge variant="outline" className="border-gray-500 text-gray-500">Draft</Badge>;
    case 'Expired':
      return <Badge variant="secondary">Expired</Badge>;
    case 'Pending':
      return <Badge variant="outline" className="border-amber-500 text-amber-500">Pending Approval</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default OfferStatusBadge;
