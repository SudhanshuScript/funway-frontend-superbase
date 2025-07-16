
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types/navigation";
import { useLocation } from "react-router-dom";

interface NavItemProps {
  item: NavItem;
  collapsed: boolean;
  getCategoryColor: (category?: string) => string;
}

export const NavItemComponent: React.FC<NavItemProps> = ({ 
  item, 
  collapsed, 
  getCategoryColor 
}) => {
  const location = useLocation();
  const isActive = location.pathname === item.href;
  
  return (
    <Link
      key={item.name}
      to={item.href}
      className={cn(
        "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
        isActive
          ? item.category
            ? `bg-${item.category}/10 text-${item.category}-light`
            : "bg-accent text-foreground"
          : "text-sidebar-foreground hover:bg-accent/50",
        getCategoryColor(item.category)
      )}
    >
      <item.icon
        className={cn(
          "flex-shrink-0 h-5 w-5",
          collapsed ? "mr-0 mx-auto" : "mr-3"
        )}
      />
      {!collapsed && <span>{item.name}</span>}
    </Link>
  );
};
