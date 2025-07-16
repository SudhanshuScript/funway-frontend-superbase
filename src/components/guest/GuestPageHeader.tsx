
import React from "react";
import { User, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GuestPageHeaderProps {
  onAddGuest: () => void;
}

const GuestPageHeader: React.FC<GuestPageHeaderProps> = ({ onAddGuest }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <User className="h-6 w-6 mr-2" />
        <h2 className="text-2xl font-bold">Guest Management</h2>
      </div>
      <Button onClick={onAddGuest}>
        <UserPlus className="mr-2 h-4 w-4" /> Add New Guest
      </Button>
    </div>
  );
};

export default GuestPageHeader;
