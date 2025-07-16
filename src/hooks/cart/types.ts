
import { AbandonedCart, AbandonedCartStats, ReminderTemplate, FollowUpRecord, ReminderMethod } from '@/types/bookingTypes';

export type CartFilter = "active" | "archived" | "recovered";

export interface UseAbandonedCartFiltersResult {
  activeFilter: CartFilter;
  setActiveFilter: (filter: CartFilter) => void;
  filteredCarts: AbandonedCart[];
  filterCarts: (carts: AbandonedCart[], searchQuery: string) => AbandonedCart[];
}

export interface UseCartActionsResult {
  sendReminder: (cartId: string, templateId: string, method: ReminderMethod) => Promise<boolean>;
  offerDiscount: (cartId: string, percentage: number) => Promise<string>;
  recoverCart: (cartId: string) => Promise<boolean>;
  archiveCart: (cartId: string, reason: string) => Promise<boolean>;
  unarchiveCart: (cartId: string) => Promise<boolean>;
  loading: boolean;
}

export interface UseBulkActionsResult {
  sendBulkReminders: (cartIds: string[], templateId: string, method: ReminderMethod) => Promise<number>;
  loading: boolean;
}
