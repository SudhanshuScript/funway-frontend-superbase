
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User } from "lucide-react";

interface ProfileSectionProps {
  currentUser: {
    name: string;
    email: string;
    role: string;
  };
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ currentUser }) => {
  const [isFormModified, setIsFormModified] = useState(false);

  const handleInputChange = () => {
    setIsFormModified(true);
  };

  const handleSaveChanges = () => {
    toast.success("Profile information updated successfully");
    setIsFormModified(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your personal information here.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              defaultValue={currentUser.name} 
              onChange={handleInputChange} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              defaultValue={currentUser.email} 
              onChange={handleInputChange} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone" 
              defaultValue="+1 (555) 123-4567" 
              onChange={handleInputChange} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input 
              id="role" 
              value={currentUser.role.replace('_', ' ').toUpperCase()} 
              readOnly 
            />
          </div>
        </div>
        <Button onClick={handleSaveChanges} disabled={!isFormModified}>
          {isFormModified ? "Save Changes" : "No Changes to Save"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileSection;
