
import React from "react";
import { NavItem } from "@/types/navigation";
import { NavItemComponent } from "./NavItem";
import { SectionHeader } from "./SectionHeader";

interface NavSectionProps {
  title: string;
  items: NavItem[];
  collapsed: boolean;
  getCategoryColor: (category?: string) => string;
}

export const NavSection: React.FC<NavSectionProps> = ({ 
  title, 
  items, 
  collapsed, 
  getCategoryColor 
}) => {
  if (items.length === 0) return null;
  
  return (
    <div className="mb-4">
      <SectionHeader title={title} collapsed={collapsed} />
      <div className="space-y-1">
        {items.map((item) => (
          <NavItemComponent 
            key={item.name} 
            item={item} 
            collapsed={collapsed} 
            getCategoryColor={getCategoryColor} 
          />
        ))}
      </div>
    </div>
  );
};
