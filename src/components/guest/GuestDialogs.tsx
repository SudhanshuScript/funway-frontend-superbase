
import React from "react";
import { GuestProfileDialog } from "@/components/guest/GuestProfileDialog";
import { SendOfferDialog } from "@/components/guest/SendOfferDialog";
import { AddGuestDialog } from "@/components/guest/AddGuestDialog";
import { Guest } from "@/types/guestTypes";

interface GuestDialogsProps {
  showGuestProfile: boolean;
  setShowGuestProfile: (show: boolean) => void;
  showSendOffer: boolean;
  setShowSendOffer: (show: boolean) => void;
  showAddGuest: boolean;
  setShowAddGuest: (show: boolean) => void;
  selectedGuest: Guest | null;
  selectedGuests: Guest[];
  onAddGuest: (guestData: any) => void;
}

const GuestDialogs: React.FC<GuestDialogsProps> = ({
  showGuestProfile,
  setShowGuestProfile,
  showSendOffer,
  setShowSendOffer,
  showAddGuest,
  setShowAddGuest,
  selectedGuest,
  selectedGuests,
  onAddGuest,
}) => {
  return (
    <>
      {/* Guest Profile Dialog */}
      <GuestProfileDialog 
        open={showGuestProfile} 
        onOpenChange={setShowGuestProfile}
        guest={selectedGuest}
        onSendOffer={() => {
          if (selectedGuest) {
            setShowGuestProfile(false);
            setShowSendOffer(true);
          }
        }}
      />
      
      {/* Send Offer Dialog */}
      <SendOfferDialog 
        open={showSendOffer} 
        onOpenChange={setShowSendOffer}
        guest={selectedGuest}
        selectedGuests={selectedGuests}
      />
      
      {/* Add Guest Dialog */}
      <AddGuestDialog 
        open={showAddGuest} 
        onOpenChange={setShowAddGuest}
        onAddGuest={onAddGuest}
      />
    </>
  );
};

export default GuestDialogs;
