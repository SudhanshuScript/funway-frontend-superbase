import React, { useState } from "react";
import { MenuItem } from "@/types/menuTypes";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MenuItemSelectorProps {
  allItems: MenuItem[];
  selectedItems: string[];
  setSelectedItems: (items: string[]) => void;
  excludeIds?: string[];
}

export function MenuItemSelector({
  allItems,
  selectedItems,
  setSelectedItems,
  excludeIds = []
}: MenuItemSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  // Get available items (excluding those that should be excluded)
  const availableItems = allItems.filter(item => 
    !excludeIds.includes(item.id.toString())
  );
  
  // Get all unique categories
  const categories = Array.from(
    new Set(availableItems.map(item => item.category))
  ).sort();
  
  // Filter items based on search query and category
  const filteredItems = availableItems.filter(item => {
    const matchesSearch = searchQuery === "" || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = categoryFilter === null || item.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  // Handle checkbox changes
  const toggleItem = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };
  
  // Select all displayed items
  const selectAllDisplayed = () => {
    const displayedIds = filteredItems.map(item => item.id.toString());
    
    // If all displayed items are already selected, deselect them
    if (displayedIds.every(id => selectedItems.includes(id))) {
      setSelectedItems(selectedItems.filter(id => !displayedIds.includes(id)));
    }
    // Otherwise select all displayed items
    else {
      const newSelected = [...selectedItems];
      displayedIds.forEach(id => {
        if (!newSelected.includes(id)) {
          newSelected.push(id);
        }
      });
      setSelectedItems(newSelected);
    }
  };
  
  // Check if all displayed items are selected
  const allDisplayedSelected = 
    filteredItems.length > 0 && 
    filteredItems.every(item => selectedItems.includes(item.id.toString()));
  
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search items..."
          className="pl-8"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="flex flex-wrap gap-1">
        <Button
          variant={categoryFilter === null ? "secondary" : "outline"}
          size="sm"
          className="h-7 text-xs"
          onClick={() => setCategoryFilter(null)}
        >
          All
        </Button>
        {categories.map(category => (
          <Button
            key={category}
            variant={categoryFilter === category ? "secondary" : "outline"}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setCategoryFilter(category)}
          >
            {category}
          </Button>
        ))}
      </div>
      
      <div className="flex items-center justify-between py-1 px-2">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="select-all" 
            checked={allDisplayedSelected}
            onCheckedChange={selectAllDisplayed}
          />
          <label htmlFor="select-all" className="text-sm">
            Select all items {filteredItems.length > 0 ? `(${filteredItems.length})` : ''}
          </label>
        </div>
        
        <span className="text-xs text-muted-foreground">
          {selectedItems.length} selected
        </span>
      </div>
      
      <ScrollArea className="h-[320px] border rounded-md">
        {filteredItems.length > 0 ? (
          <div className="p-2 space-y-1">
            {filteredItems.map(item => (
              <div 
                key={item.id} 
                className={cn(
                  "flex items-start p-2 rounded hover:bg-muted/50",
                  selectedItems.includes(item.id.toString()) ? "bg-muted/50" : ""
                )}
              >
                <Checkbox 
                  id={`item-${item.id}`}
                  className="mt-1 mr-2"
                  checked={selectedItems.includes(item.id.toString())}
                  onCheckedChange={() => toggleItem(item.id.toString())}
                />
                <div className="flex flex-col">
                  <label 
                    htmlFor={`item-${item.id}`} 
                    className="font-medium cursor-pointer text-sm"
                  >
                    {item.name}
                  </label>
                  <div className="flex flex-wrap items-center gap-1 mt-1">
                    <Badge variant="outline" className="text-[10px] h-4 font-normal">
                      {item.category}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] h-4 font-normal">
                      ${item.price.toFixed(2)}
                    </Badge>
                    {item.vegetarian ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 text-[10px] h-4 font-normal">
                        Veg
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 text-[10px] h-4 font-normal">
                        Non-Veg
                      </Badge>
                    )}
                    {item.popular && (
                      <Badge variant="secondary" className="bg-amber-100 text-amber-800 text-[10px] h-4 font-normal">
                        Popular
                      </Badge>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <p className="text-sm text-muted-foreground">
              No items found matching your search
            </p>
            <Button 
              variant="link" 
              className="h-auto p-0 text-xs" 
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter(null);
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
