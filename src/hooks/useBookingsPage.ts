
import { useState } from "react";
import { useAuditLogger } from "@/utils/auditLogger";

export function useBookingsPage() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showStats, setShowStats] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const [showMultiStepForm, setShowMultiStepForm] = useState(false);
  const { logEvent } = useAuditLogger();
  
  const handleCreateBooking = () => {
    setShowMultiStepForm(true);
    logEvent('navigation', 'create_booking', 'navigate');
  };

  const handleDeleteBooking = (bookingId: string) => {
    setBookingToDelete(bookingId);
    setShowDeleteDialog(true);
  };

  const handleMultiStepFormCancel = () => {
    setShowMultiStepForm(false);
    setActiveTab("upcoming");
  };

  const toggleStats = () => {
    setShowStats(prev => !prev);
  };

  return {
    activeTab,
    setActiveTab,
    showStats,
    setShowStats,
    toggleStats,
    showDeleteDialog,
    setShowDeleteDialog,
    bookingToDelete,
    setBookingToDelete,
    showMultiStepForm,
    handleCreateBooking,
    handleDeleteBooking,
    handleMultiStepFormCancel
  };
}
