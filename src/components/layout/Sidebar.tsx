import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useUserRole } from "@/providers/UserRoleProvider";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { navigationItems } from "./navigation/navigationItems";
import { NavSection } from "./navigation/NavSection";
import { UserProfile } from "./navigation/UserProfile";
import { NavItem } from "@/types/navigation";
import { Logo } from "@/components/ui/Logo";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { currentUser } = useUserRole();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "dining":
        return "text-dining dark:text-dining-light hover:bg-dining/10";
      default:
        return "hover:bg-accent";
    }
  };

  const filteredNavItems = navigationItems.filter(
    item => !item.roles || (currentUser && item.roles.includes(currentUser.role))
  );

  // Filter items by section with proper type casting
  const mainItems = filteredNavItems.filter(item => 
    ["Dashboard", "Reports & Analytics"].includes(item.name)
  );
  
  const managementItems = filteredNavItems.filter(item => 
    ["Franchises", "Staff"].includes(item.name)
  );
  
  const experienceItems = filteredNavItems.filter(item => 
    ["Dining", "Sessions"].includes(item.name)
  );
  
  const customerItems = filteredNavItems.filter(item => 
    ["Bookings", "Guests", "Lead Management", "Payments", "Offers"].includes(item.name)
  );
  
  const systemItems = filteredNavItems.filter(item => 
    ["Settings", "Supabase Stats"].includes(item.name)
  );

  return (
    <div
      className={cn(
        "h-screen bg-sidebar border-r border-border transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center">
            <Logo size="md" />
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="ml-auto text-foreground"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      
      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="space-y-1 px-2">
          <NavSection 
            title="Main" 
            items={mainItems} 
            collapsed={collapsed} 
            getCategoryColor={getCategoryColor} 
          />
          
          <NavSection 
            title="Management" 
            items={managementItems} 
            collapsed={collapsed} 
            getCategoryColor={getCategoryColor} 
          />
          
          <NavSection 
            title="Experiences" 
            items={experienceItems} 
            collapsed={collapsed} 
            getCategoryColor={getCategoryColor} 
          />
          
          <NavSection 
            title="Customers" 
            items={customerItems} 
            collapsed={collapsed} 
            getCategoryColor={getCategoryColor} 
          />
          
          <NavSection 
            title="System" 
            items={systemItems} 
            collapsed={collapsed} 
            getCategoryColor={getCategoryColor} 
          />
        </nav>
      </div>

      <UserProfile collapsed={collapsed} />
    </div>
  );
}
