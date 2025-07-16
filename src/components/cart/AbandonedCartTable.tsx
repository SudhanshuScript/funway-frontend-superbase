
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AbandonedCart, ReminderMethod } from "@/types/bookingTypes";
import { AbandonedCartRow } from './AbandonedCartRow';
import { ReminderDialog } from './dialogs/ReminderDialog';
import { DiscountDialog } from './dialogs/DiscountDialog';
import { ArchiveCartDialog } from './dialogs/ArchiveCartDialog';
import { RecoverCartDialog } from './dialogs/RecoverCartDialog';
import { Card } from '@/components/ui/card';

interface AbandonedCartTableProps {
  carts: AbandonedCart[];
  reminderTemplates: Array<{
    id: string;
    name: string;
    method: ReminderMethod;
  }>;
  onSendReminder: (cartId: string, templateId: string, method: ReminderMethod) => Promise<boolean>;
  onOfferDiscount: (cartId: string, percentage: number) => Promise<string>;
  onRecoverCart: (cartId: string) => Promise<boolean>;
  onArchiveCart: (cartId: string, reason: string) => Promise<boolean>;
  onUnarchiveCart: (cartId: string) => Promise<boolean>;
}

export function AbandonedCartTable({ 
  carts,
  reminderTemplates,
  onSendReminder,
  onOfferDiscount,
  onRecoverCart,
  onArchiveCart,
  onUnarchiveCart
}: AbandonedCartTableProps) {
  const [selectedCart, setSelectedCart] = useState<AbandonedCart | null>(null);
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [showDiscountDialog, setShowDiscountDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [showRecoverDialog, setShowRecoverDialog] = useState(false);
  
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<ReminderMethod>("email");
  const [discountPercentage, setDiscountPercentage] = useState(10);
  const [archiveReason, setArchiveReason] = useState("");
  
  const handleSendReminder = (cart: AbandonedCart) => {
    setSelectedCart(cart);
    setSelectedTemplateId(reminderTemplates[0]?.id || "");
    setSelectedMethod("email");
    setShowReminderDialog(true);
  };
  
  const handleOfferDiscount = (cart: AbandonedCart) => {
    setSelectedCart(cart);
    setDiscountPercentage(10);
    setShowDiscountDialog(true);
  };
  
  const handleArchiveCart = (cart: AbandonedCart) => {
    setSelectedCart(cart);
    setArchiveReason("");
    setShowArchiveDialog(true);
  };
  
  const handleRecoverCart = (cart: AbandonedCart) => {
    setSelectedCart(cart);
    setShowRecoverDialog(true);
  };
  
  const handleViewDetails = (cart: AbandonedCart) => {
    // View details functionality would be implemented here
    console.log("View details for cart:", cart.id);
  };
  
  const confirmSendReminder = async () => {
    if (!selectedCart || !selectedTemplateId) return;
    
    try {
      await onSendReminder(selectedCart.id, selectedTemplateId, selectedMethod);
      setShowReminderDialog(false);
    } catch (error) {
      console.error("Failed to send reminder:", error);
    }
  };
  
  const confirmOfferDiscount = async () => {
    if (!selectedCart) return;
    
    try {
      await onOfferDiscount(selectedCart.id, discountPercentage);
      setShowDiscountDialog(false);
    } catch (error) {
      console.error("Failed to offer discount:", error);
    }
  };
  
  const confirmArchiveCart = async () => {
    if (!selectedCart || !archiveReason) return;
    
    try {
      await onArchiveCart(selectedCart.id, archiveReason);
      setShowArchiveDialog(false);
    } catch (error) {
      console.error("Failed to archive cart:", error);
    }
  };
  
  const confirmRecoverCart = async () => {
    if (!selectedCart) return;
    
    try {
      await onRecoverCart(selectedCart.id);
      setShowRecoverDialog(false);
    } catch (error) {
      console.error("Failed to recover cart:", error);
    }
  };
  
  return (
    <>
      <Card className="shadow-sm border overflow-hidden">
        <div className="overflow-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-muted/50">
                <TableHead className="w-[100px]">Cart ID</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead>Session</TableHead>
                <TableHead>Booking Date</TableHead>
                <TableHead>Abandoned On</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Reminder Status</TableHead>
                <TableHead className="text-right sticky right-0 bg-muted/50 shadow-sm z-10">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {carts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <p className="text-lg font-medium">No abandoned carts found</p>
                      <p className="text-sm">There are no carts matching your current filters</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                carts.map((cart) => (
                  <AbandonedCartRow
                    key={cart.id}
                    cart={cart}
                    onSendReminder={handleSendReminder}
                    onOfferDiscount={handleOfferDiscount}
                    onRecoverCart={handleRecoverCart}
                    onArchiveCart={handleArchiveCart}
                    onUnarchiveCart={onUnarchiveCart}
                    onViewDetails={handleViewDetails}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <ReminderDialog
        open={showReminderDialog}
        onOpenChange={setShowReminderDialog}
        selectedCart={selectedCart}
        selectedTemplateId={selectedTemplateId}
        setSelectedTemplateId={setSelectedTemplateId}
        selectedMethod={selectedMethod}
        setSelectedMethod={setSelectedMethod}
        reminderTemplates={reminderTemplates}
        onConfirmSendReminder={confirmSendReminder}
      />

      <DiscountDialog
        open={showDiscountDialog}
        onOpenChange={setShowDiscountDialog}
        selectedCart={selectedCart}
        discountPercentage={discountPercentage}
        setDiscountPercentage={setDiscountPercentage}
        onConfirmOfferDiscount={confirmOfferDiscount}
      />

      <ArchiveCartDialog
        open={showArchiveDialog}
        onOpenChange={setShowArchiveDialog}
        selectedCart={selectedCart}
        archiveReason={archiveReason}
        setArchiveReason={setArchiveReason}
        onConfirmArchiveCart={confirmArchiveCart}
      />

      <RecoverCartDialog
        open={showRecoverDialog}
        onOpenChange={setShowRecoverDialog}
        selectedCart={selectedCart}
        onConfirmRecoverCart={confirmRecoverCart}
      />
    </>
  );
}
