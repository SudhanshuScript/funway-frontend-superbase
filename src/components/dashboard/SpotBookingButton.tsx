
import React, { useState } from "react";
import { useUserRole } from "@/providers/UserRoleProvider";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";
import { SpotBookingModal } from "./SpotBookingModal";

export const SpotBookingButton: React.FC = () => {
  const { isRole } = useUserRole();
  const [showModal, setShowModal] = useState(false);
  
  // Only show button for authorized roles
  const authorized = isRole(["superadmin", "franchise_owner", "franchise_manager"]);
  
  if (!authorized) {
    return null;
  }
  
  return (
    <>
      <Button 
        onClick={() => setShowModal(true)}
        variant="spotBooking"
        className="relative overflow-hidden group"
        aria-label="Create Spot Booking"
      >
        <div className="absolute inset-0 w-3 bg-white opacity-10 transform -skew-x-[20deg] group-hover:animate-shine"></div>
        <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
        Spot Booking
      </Button>
      
      <SpotBookingModal
        open={showModal}
        onOpenChange={setShowModal}
        defaultGuestType="First Timer"
      />
    </>
  );
};
