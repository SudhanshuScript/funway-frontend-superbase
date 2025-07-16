
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserRole } from "@/providers/UserRoleProvider";
import { useNavigate } from "react-router-dom";
import { Ticket, PlusCircle } from "lucide-react";
import OffersTable from "@/components/offers/OffersTable";
import OfferPerformanceStats from "@/components/offers/OfferPerformanceStats";
import OfferFiltersBar from "@/components/offers/OfferFiltersBar";
import OfferCreationWizard from "@/components/offers/OfferCreationWizard";
import { useOffers } from "@/components/offers/hooks/useOffers";
import OffersManageCard from "@/components/offers/OffersManageCard";

const Offers = () => {
  const { currentUser } = useUserRole();
  const navigate = useNavigate();
  const [showCreationWizard, setShowCreationWizard] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { offers, analytics, isLoading, filters, setFilters } = useOffers();

  React.useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredOffers = offers.filter(offer => 
    offer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    offer.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Ticket className="h-6 w-6 mr-2" />
            <h2 className="text-2xl font-bold">Offers & Promotions</h2>
          </div>
          <Button onClick={() => setShowCreationWizard(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Offer
          </Button>
        </div>

        {showCreationWizard ? (
          <OfferCreationWizard onClose={() => setShowCreationWizard(false)} />
        ) : (
          <>
            <OfferPerformanceStats analytics={analytics} />
            
            <OffersManageCard 
              searchQuery={searchQuery}
              handleSearch={handleSearch}
              filters={filters}
              setFilters={setFilters}
              filteredOffers={filteredOffers}
              isLoading={isLoading}
              isSuperAdmin={currentUser.role === "superadmin"}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Offers;
