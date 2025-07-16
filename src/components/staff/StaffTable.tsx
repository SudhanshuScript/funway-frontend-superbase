
import React from "react";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { StaffMember } from "@/types/staffTypes";
import StaffTableRow from "@/components/staff/StaffTableRow";

interface StaffTableProps {
  filteredStaff: StaffMember[];
  onAddStaff: () => void;
  onViewProfile: (staff: StaffMember) => void;
  onEditStaff: (staffId: string) => void;
  handleStatusChange: (staffId: string, newStatus: string) => void;
  activeTab: string;
}

const StaffTable: React.FC<StaffTableProps> = ({
  filteredStaff,
  onAddStaff,
  onViewProfile,
  onEditStaff,
  handleStatusChange,
  activeTab
}) => {
  if (filteredStaff.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-muted/20 rounded-lg border border-border/50">
        <Users className="h-12 w-12 text-muted-foreground mb-2 opacity-60" />
        <h3 className="text-lg font-medium mb-2">No Staff Found</h3>
        <p className="text-muted-foreground text-center max-w-md">
          {activeTab === "all" ? 
            "There are no staff members matching your filters. Try adjusting your search criteria." :
            `No staff members found in the ${activeTab.replace('_', ' ')} category.`
          }
        </p>
        <Button onClick={onAddStaff} className="mt-4" variant="secondary">
          <Users className="mr-2 h-4 w-4" /> Add New Staff Member
        </Button>
      </div>
    );
  }
  
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[250px] py-3">Staff Member</TableHead>
              <TableHead className="w-[180px] py-3">Role & Department</TableHead>
              <TableHead className="py-3">Contact Information</TableHead>
              <TableHead className="w-[150px] py-3">Franchise</TableHead>
              <TableHead className="w-[120px] py-3">Status</TableHead>
              <TableHead className="text-right w-[100px] py-3">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStaff.map((member) => (
              <StaffTableRow
                key={member.id}
                member={member}
                onViewProfile={onViewProfile}
                onEditStaff={onEditStaff}
                handleStatusChange={handleStatusChange}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StaffTable;
