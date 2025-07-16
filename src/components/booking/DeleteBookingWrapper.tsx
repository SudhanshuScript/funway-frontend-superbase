
import React from "react";
import { DeleteBookingDialog } from "@/components/booking/DeleteBookingDialog";
import { toast } from "sonner";
import { useAuditLogger } from "@/utils/auditLogger";

interface DeleteBookingWrapperProps {
  showDeleteDialog: boolean;
  setShowDeleteDialog: (show: boolean) => void;
  bookingToDelete: string | null;
  setBookingToDelete: (id: string | null) => void;
}

export function DeleteBookingWrapper({
  showDeleteDialog,
  setShowDeleteDialog,
  bookingToDelete,
  setBookingToDelete
}: DeleteBookingWrapperProps) {
  const { logEvent } = useAuditLogger();

  const confirmDeleteBooking = () => {
    if (bookingToDelete) {
      // In a real app, this would call an API to delete the booking
      toast.success("Booking deleted successfully");
      logEvent('booking', bookingToDelete, 'delete');
      setShowDeleteDialog(false);
      setBookingToDelete(null);
    }
  };

  return (
    <>
      {showDeleteDialog && bookingToDelete && (
        <DeleteBookingDialog 
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onDelete={confirmDeleteBooking}
          onCancel={() => setShowDeleteDialog(false)}
          bookingId={bookingToDelete}
          bookingName={"Booking"} // Placeholder, should be replaced with actual booking name
        />
      )}
    </>
  );
}
