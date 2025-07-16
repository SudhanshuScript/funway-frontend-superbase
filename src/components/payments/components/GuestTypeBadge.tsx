
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface GuestTypeBadgeProps {
  type: string;
}

export function GuestTypeBadge({ type }: GuestTypeBadgeProps) {
  switch (type) {
    case "VIP":
      return <Badge variant="vip">VIP</Badge>;
    case "Regular":
      return <Badge variant="regular">Regular</Badge>;
    case "First Timer":
      return <Badge variant="firstTimer">First Timer</Badge>;
    default:
      return null;
  }
}
