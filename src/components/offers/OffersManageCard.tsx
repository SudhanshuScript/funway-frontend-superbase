
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OffersTable from "@/components/offers/OffersTable";
import OfferFiltersBar from "@/components/offers/OfferFiltersBar";
import { Offer, OfferFilters } from "@/types/offerTypes";

interface OffersManageCardProps {
  searchQuery: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  filters: OfferFilters;
  setFilters: React.Dispatch<React.SetStateAction<OfferFilters>>;
  filteredOffers: Offer[];
  isLoading: boolean;
  isSuperAdmin: boolean;
}

const OffersManageCard: React.FC<OffersManageCardProps> = ({
  searchQuery,
  handleSearch,
  filters,
  setFilters,
  filteredOffers,
  isLoading,
  isSuperAdmin
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Offers</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search offers..."
              className="pl-8"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <OfferFiltersBar filters={filters} setFilters={setFilters} />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Offers</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="expired">Expired</TabsTrigger>
          </TabsList>
          
          <OffersTable 
            offers={filteredOffers} 
            isLoading={isLoading}
            isSuperAdmin={isSuperAdmin}
          />
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default OffersManageCard;
