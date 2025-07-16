
import React from "react";
import { Button } from "@/components/ui/button";
import { Coffee, Eye, Plus, Download } from "lucide-react";
import { useFranchiseSelector } from "@/hooks/useFranchiseSelector";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useUserRole } from "@/providers/UserRoleProvider";
import { toast } from "sonner";

interface DiningHeaderProps {
  onAddMenuItem: () => void;
}

export function DiningHeader({ onAddMenuItem }: DiningHeaderProps) {
  const { selectedFranchiseId, franchises, handleFranchiseChange, isSuperAdmin } = useFranchiseSelector();

  const handleMenuPreviewClick = () => {
    toast.info("Opening menu preview");
    // In a real app, this would open a preview of the menu
  };

  const handleExportClick = () => {
    toast.success("Exporting menu data");
    // In a real app, this would export the menu data
  };

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="flex items-center">
        <Coffee className="h-6 w-6 mr-2" />
        <h2 className="text-2xl font-bold">Dining Management</h2>
      </div>
      
      {/* Franchise selector for superadmin */}
      {isSuperAdmin && (
        <div className="flex items-center gap-4">
          <Select
            value={selectedFranchiseId}
            onValueChange={handleFranchiseChange}
          >
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Select franchise" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Franchises</SelectItem>
              {franchises.map(franchise => (
                <SelectItem key={franchise.id} value={franchise.id}>
                  {franchise.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="flex gap-2">
        <Button variant="outline" onClick={handleMenuPreviewClick}>
          <Eye className="mr-2 h-4 w-4" />
          Menu Preview
        </Button>
        <Button variant="outline" onClick={handleExportClick}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button onClick={onAddMenuItem}>
          <Plus className="mr-2 h-4 w-4" />
          Add Menu Item
        </Button>
      </div>
    </div>
  );
}
