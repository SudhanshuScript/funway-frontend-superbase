
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AbandonedCartTable } from "../AbandonedCartTable";
import { ReminderTemplate, AbandonedCart } from '@/types/bookingTypes';

interface ActiveCartsTabProps {
  carts: AbandonedCart[];
  reminderTemplates: ReminderTemplate[];
  onSendReminder: (cartId: string, templateId: string, method: string) => Promise<boolean>;
  onOfferDiscount: (cartId: string, percentage: number) => Promise<string>;
  onRecoverCart: (cartId: string) => Promise<boolean>;
  onArchiveCart: (cartId: string) => Promise<boolean>;
  onUnarchiveCart: (cartId: string) => Promise<boolean>;
}

export function ActiveCartsTab({
  carts,
  reminderTemplates,
  onSendReminder,
  onOfferDiscount,
  onRecoverCart,
  onArchiveCart,
  onUnarchiveCart,
}: ActiveCartsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Abandoned Carts</CardTitle>
      </CardHeader>
      <CardContent>
        <AbandonedCartTable
          carts={carts}
          reminderTemplates={reminderTemplates}
          onSendReminder={onSendReminder}
          onOfferDiscount={onOfferDiscount}
          onRecoverCart={onRecoverCart}
          onArchiveCart={onArchiveCart}
          onUnarchiveCart={onUnarchiveCart}
        />
      </CardContent>
    </Card>
  );
}
