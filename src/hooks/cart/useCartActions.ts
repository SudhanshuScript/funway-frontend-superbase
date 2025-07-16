
import { useState } from 'react';
import { toast } from 'sonner';
import { ReminderMethod } from '@/types/bookingTypes';
import { useAuditLogger } from '@/utils/auditLogger';
import { UseCartActionsResult } from './types';

export function useCartActions(): UseCartActionsResult {
  const [loading, setLoading] = useState(false);
  const { logEvent } = useAuditLogger();

  const sendReminder = async (cartId: string, templateId: string, method: ReminderMethod) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      await logEvent('abandoned_cart', cartId, 'reminder_sent', { method, templateId });
      toast.success('Reminder sent successfully');
      return true;
    } catch (error) {
      console.error("Error sending reminder:", error);
      toast.error("Failed to send reminder");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const offerDiscount = async (cartId: string, percentage: number) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const discountCode = `COMEBACK${percentage}`;
      await logEvent('abandoned_cart', cartId, 'discount_offered', { percentage, discountCode });
      toast.success(`Discount code ${discountCode} created and offered`);
      return discountCode;
    } catch (error) {
      console.error("Error offering discount:", error);
      toast.error("Failed to offer discount");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const recoverCart = async (cartId: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await logEvent('abandoned_cart', cartId, 'cart_recovered', {});
      toast.success('Cart successfully converted to booking');
      return true;
    } catch (error) {
      console.error("Error recovering cart:", error);
      toast.error("Failed to convert cart to booking");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const archiveCart = async (cartId: string, reason: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await logEvent('abandoned_cart', cartId, 'cart_archived', { reason });
      toast.success('Cart archived successfully');
      return true;
    } catch (error) {
      console.error("Error archiving cart:", error);
      toast.error("Failed to archive cart");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const unarchiveCart = async (cartId: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Cart unarchived successfully');
      return true;
    } catch (error) {
      console.error("Error unarchiving cart:", error);
      toast.error("Failed to unarchive cart");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    sendReminder,
    offerDiscount,
    recoverCart,
    archiveCart,
    unarchiveCart,
    loading
  };
}
