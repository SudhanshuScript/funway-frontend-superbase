
import React from "react";
import { User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Guest, getGuestTypeColor } from "@/types/guestTypes";
import GuestTableRow from "@/components/guest/GuestTableRow";

interface GuestTableProps {
  filteredGuests: Guest[];
  onAddGuest: () => void;
  onViewProfile: (guest: Guest) => void;
  onSendOffer: (guestId: string) => void;
  activeTab: string;
}

const GuestTable: React.FC<GuestTableProps> = ({
  filteredGuests,
  onAddGuest,
  onViewProfile,
  onSendOffer,
  activeTab
}) => {
  if (filteredGuests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-muted/20 rounded-lg border border-border/50">
        <User className="h-12 w-12 text-muted-foreground mb-2 opacity-60" />
        <h3 className="text-lg font-medium mb-2">No Guests Found</h3>
        <p className="text-muted-foreground text-center max-w-md">
          {activeTab === "all" ? 
            "There are no guests matching your filters. Try adjusting your search criteria." :
            `No guests found in the ${activeTab.replace('_', ' ')} category.`
          }
        </p>
        <Button onClick={onAddGuest} className="mt-4" variant="secondary">
          <User className="mr-2 h-4 w-4" /> Add New Guest
        </Button>
      </div>
    );
  }
  
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[250px] py-3">Guest</TableHead>
              <TableHead className="py-3">Contact Information</TableHead>
              <TableHead className="py-3">Franchise</TableHead>
              <TableHead className="w-[100px] py-3">Type</TableHead>
              <TableHead className="w-[100px] py-3 text-center">Visits</TableHead>
              <TableHead className="w-[150px] py-3">Last Visit</TableHead>
              <TableHead className="py-3">Preferences</TableHead>
              <TableHead className="w-[100px] py-3">Loyalty</TableHead>
              <TableHead className="w-[120px] py-3">Upcoming</TableHead>
              <TableHead className="text-right w-[100px] py-3">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGuests.map((guest) => (
              <GuestTableRow
                key={guest.id}
                guest={guest}
                onViewProfile={onViewProfile}
                onSendOffer={onSendOffer}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default GuestTable;
