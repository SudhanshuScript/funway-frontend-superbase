
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useUserRole } from "@/providers/UserRoleProvider";
import { useNavigate } from "react-router-dom";
import { Guest } from "@/types/guestTypes";
import { useGuestData } from "@/hooks/useGuestData";
import { useGuestSelection } from "@/hooks/useGuestSelection";
import GuestPageHeader from "@/components/guest/GuestPageHeader";
import GuestContent from "@/components/guest/GuestContent";
import GuestDialogs from "@/components/guest/GuestDialogs";

const Guests = () => {
  const { currentUser } = useUserRole();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [showGuestProfile, setShowGuestProfile] = useState(false);
  const [showSendOffer, setShowSendOffer] = useState(false);
  const [showAddGuest, setShowAddGuest] = useState(false);
  
  const { selectedGuest, selectedGuests, handleViewProfile, setSelectedGuest } = useGuestSelection();

  // Get guest data and filters
  const {
    allGuests,
    filteredGuests,
    stats,
    filters,
    updateFilters,
    resetFilters,
    getAllPreferences
  } = useGuestData();
  
  const availablePreferences = getAllPreferences();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  const handleViewProfileAndShow = (guest: Guest) => {
    const selectedGuest = handleViewProfile(guest);
    setShowGuestProfile(true);
    return selectedGuest;
  };

  const handleSendOffer = (guestId: string) => {
    const guest = allGuests.find(g => g.id === guestId);
    if (guest) {
      setSelectedGuest(guest);
      setShowSendOffer(true);
    }
  };
  
  const handleAddGuest = (guestData: any) => {
    // In a real app, this would make an API call to create a guest
    console.log("Adding guest:", guestData);
    // Then refresh the guest list
  };

  // Count guests by type for the tabs
  const guestCounts = {
    all: allGuests.length,
    vip: allGuests.filter(g => g.guestType === "VIP").length,
    new: allGuests.filter(g => g.guestType === "New").length,
    regular: allGuests.filter(g => g.guestType === "Regular").length,
    inactive: allGuests.filter(g => g.guestType === "Inactive").length,
    high_potential: allGuests.filter(g => g.guestType === "High Potential").length
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <GuestPageHeader onAddGuest={() => setShowAddGuest(true)} />
        
        {/* Main Content */}
        <GuestContent 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          guestCounts={guestCounts}
          stats={stats}
          filteredGuests={filteredGuests}
          filters={filters}
          updateFilters={updateFilters}
          resetFilters={resetFilters}
          availablePreferences={availablePreferences}
          onAddGuest={() => setShowAddGuest(true)}
          onViewProfile={handleViewProfileAndShow}
          onSendOffer={handleSendOffer}
        />
        
        {/* Dialogs */}
        <GuestDialogs 
          showGuestProfile={showGuestProfile}
          setShowGuestProfile={setShowGuestProfile}
          showSendOffer={showSendOffer}
          setShowSendOffer={setShowSendOffer}
          showAddGuest={showAddGuest}
          setShowAddGuest={setShowAddGuest}
          selectedGuest={selectedGuest}
          selectedGuests={selectedGuests}
          onAddGuest={handleAddGuest}
        />
      </div>
    </DashboardLayout>
  );
};

export default Guests;
