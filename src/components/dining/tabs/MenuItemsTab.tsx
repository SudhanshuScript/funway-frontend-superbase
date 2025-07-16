
import React, { useState } from "react";
import { MenuItem } from "@/types/menuTypes";
import { MenuTable } from "../MenuTable";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Search } from "lucide-react";

interface MenuItemsTabProps {
  menuItems: MenuItem[];
  onSelectMenuItem: (item: MenuItem) => void;
  renderSessionBadges: (sessions?: string[]) => React.ReactNode;
  isLoading: boolean;
}

export function MenuItemsTab({ 
  menuItems, 
  onSelectMenuItem, 
  renderSessionBadges, 
  isLoading 
}: MenuItemsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // Filter menu items based on search and category
  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Breakfast">Breakfast</SelectItem>
              <SelectItem value="Lunch">Lunch</SelectItem>
              <SelectItem value="Dinner">Dinner</SelectItem>
              <SelectItem value="Dessert">Dessert</SelectItem>
              <SelectItem value="Special">Special</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <MenuTable 
        menuItems={filteredMenuItems}
        onSelectMenuItem={onSelectMenuItem}
        renderSessionBadges={renderSessionBadges}
        isLoading={isLoading}
      />
    </div>
  );
}
