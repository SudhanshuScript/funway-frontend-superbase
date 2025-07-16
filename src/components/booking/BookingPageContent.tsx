
import React from "react";
import { BookingTabs } from "@/components/booking/tabs/BookingTabs";
import { BookingStatsOverview } from "@/components/booking/BookingStatsOverview";
import { DeleteBookingWrapper } from "@/components/booking/DeleteBookingWrapper";

interface BookingPageContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showStats: boolean;
  showDeleteDialog: boolean;
  setShowDeleteDialog: (show: boolean) => void;
  bookingToDelete: string | null;
  setBookingToDelete: (id: string | null) => void;
}

export function BookingPageContent({
  activeTab,
  setActiveTab,
  showStats,
  showDeleteDialog,
  setShowDeleteDialog,
  bookingToDelete,
  setBookingToDelete
}: BookingPageContentProps) {
  return (
    <div className="space-y-8">
      {showStats && (
        <div className="animate-fade-in">
          <BookingStatsOverview />
        </div>
      )}
      
      <BookingTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <DeleteBookingWrapper 
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        bookingToDelete={bookingToDelete}
        setBookingToDelete={setBookingToDelete}
      />
    </div>
  );
}
