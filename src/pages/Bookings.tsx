
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { BookingPageHeader } from "@/components/booking/header/BookingPageHeader";
import { MultiStepBookingFormWrapper } from "@/components/booking/MultiStepBookingFormWrapper";
import { BookingPageContent } from "@/components/booking/BookingPageContent";
import { useBookingsPage } from "@/hooks/useBookingsPage";
import { BreadcrumbNav } from "@/components/navigation/BreadcrumbNav";

const Bookings = () => {
  const {
    activeTab,
    setActiveTab,
    showStats,
    toggleStats,
    showDeleteDialog,
    setShowDeleteDialog,
    bookingToDelete,
    setBookingToDelete,
    showMultiStepForm,
    handleCreateBooking,
    handleMultiStepFormCancel
  } = useBookingsPage();
  
  const extraBreadcrumbItems = showMultiStepForm 
    ? [{ label: 'Create Booking', path: '/bookings/create', isActive: true }]
    : [];
  
  if (showMultiStepForm) {
    return (
      <DashboardLayout>
        <div className="p-4 sm:p-6 animate-fade-in bg-gyro-darker min-h-screen">
          <MultiStepBookingFormWrapper onCancel={handleMultiStepFormCancel} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 animate-fade-in space-y-6 bg-gyro-darker min-h-screen">
        <BookingPageHeader 
          handleCreateBooking={handleCreateBooking}
          showStats={showStats}
          setShowStats={toggleStats}
        />
        
        <BookingPageContent 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          showStats={showStats}
          showDeleteDialog={showDeleteDialog}
          setShowDeleteDialog={setShowDeleteDialog}
          bookingToDelete={bookingToDelete}
          setBookingToDelete={setBookingToDelete}
        />
      </div>
    </DashboardLayout>
  );
};

export default Bookings;
