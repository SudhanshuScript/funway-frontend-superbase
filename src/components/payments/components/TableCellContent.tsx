
import React from 'react';
import { User } from "lucide-react";
import { GuestTypeBadge } from "./GuestTypeBadge";
import { Transaction } from "../types";

interface GuestCellProps {
  transaction: Transaction;
}

export function GuestCell({ transaction }: GuestCellProps) {
  return (
    <div className="flex items-center">
      <User className="h-4 w-4 mr-2" />
      <div>
        <div className="font-medium">{transaction.customer}</div>
        <div className="flex items-center text-xs text-muted-foreground">
          <span>+{transaction.totalGuests}</span>
          {transaction.guestType && (
            <span className="ml-2">
              <GuestTypeBadge type={transaction.guestType} />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function BookingIdCell({ id }: { id: string }) {
  return <span className="font-medium">{id}</span>;
}

export function SessionCell({ name }: { name: string }) {
  return <span>{name}</span>;
}

export function DateCell({ date }: { date: string }) {
  return <span>{date}</span>;
}

export function AmountCell({ amount }: { amount: number }) {
  return <span>${amount.toFixed(2)}</span>;
}
