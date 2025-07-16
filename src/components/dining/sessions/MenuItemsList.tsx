
import React from "react";
import { MenuItem } from "@/types/menuTypes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Edit, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

interface MenuItemsListProps {
  menuItems: MenuItem[];
  onEditMenuItem: (item: MenuItem) => void;
}

export function MenuItemsList({ menuItems, onEditMenuItem }: MenuItemsListProps) {
  const handleRemoveFromSession = (item: MenuItem) => {
    // This would be implemented with the actual remove function
    toast.success(`${item.name} removed from session`);
  };
  
  if (menuItems.length === 0) {
    return (
      <div className="text-center py-6 bg-muted/20 rounded-md border border-dashed">
        <p className="text-muted-foreground">No menu items assigned to this session</p>
      </div>
    );
  }

  return (
    <ScrollArea className="max-h-[400px]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="p-3 rounded-md border border-[#2A2A2A] bg-background hover:bg-muted/10 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{item.name}</h4>
                  {item.popular && (
                    <Badge className="bg-amber-500 text-white text-xs">
                      Popular
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-1 text-sm">
                  <span className="text-muted-foreground">{item.category}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="font-medium">${item.price.toFixed(2)}</span>
                </div>

                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge
                    variant="outline"
                    className={
                      item.vegetarian
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-red-100 text-red-800 border-red-200"
                    }
                  >
                    {item.vegetarian ? "Vegetarian" : "Non-Veg"}
                  </Badge>
                  
                  {item.gluten_free && (
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                      Gluten-Free
                    </Badge>
                  )}
                  
                  {item.dairy_free && (
                    <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                      Dairy-Free
                    </Badge>
                  )}
                  
                  {item.allergens && item.allergens.length > 0 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {item.allergens.length} allergen{item.allergens.length !== 1 && 's'}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-medium text-xs">Allergens:</p>
                          <ul className="list-disc list-inside text-xs">
                            {item.allergens.map(allergen => (
                              <li key={allergen}>{allergen}</li>
                            ))}
                          </ul>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
              
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onEditMenuItem(item)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleRemoveFromSession(item)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {item.description && (
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {item.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
