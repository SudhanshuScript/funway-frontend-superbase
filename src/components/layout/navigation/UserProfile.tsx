
import React from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserRole } from "@/providers/UserRoleProvider";
import { useNavigate } from "react-router-dom";

interface UserProfileProps {
  collapsed: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({ collapsed }) => {
  const { currentUser, logout } = useUserRole();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!currentUser) return null;

  return (
    <div className="p-4 border-t border-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-accent flex-shrink-0 flex items-center justify-center">
            {currentUser?.name.charAt(0)}
          </div>
          {!collapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium text-foreground">{currentUser?.name}</p>
              <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
            </div>
          )}
        </div>
        {!collapsed && (
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut size={16} />
          </Button>
        )}
      </div>
    </div>
  );
};
