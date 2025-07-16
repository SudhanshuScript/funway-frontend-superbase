
import React from "react";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, Pencil, Trash2, Plus } from "lucide-react";
import { MenuItem } from "@/types/menuTypes";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MenuItemSelector } from "./MenuItemSelector";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface SessionMenuItemsProps {
  sessionId: number;
  sessionName: string;
  menuItems: MenuItem[];
  allMenuItems: MenuItem[];
  onAssignItems: (sessionId: number, menuItemIds: string[]) => void;
  onRemoveItem: (sessionId: number, menuItemId: string) => void;
  onEditItem: (menuItem: MenuItem) => void;
}

export function SessionMenuItems({
  sessionId,
  sessionName,
  menuItems,
  allMenuItems,
  onAssignItems,
  onRemoveItem,
  onEditItem
}: SessionMenuItemsProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
  
  const handleRemoveItem = (menuItemId: string) => {
    onRemoveItem(sessionId, menuItemId);
    toast.success(`Item removed from ${sessionName}`);
  };
  
  const handleAssignItems = () => {
    if (selectedItems.length > 0) {
      onAssignItems(sessionId, selectedItems);
      setSelectedItems([]);
      toast.success(`${selectedItems.length} items assigned to ${sessionName}`);
    } else {
      toast.error("Please select at least one menu item");
    }
  };

  return (
    <div className="mt-2">
      <Collapsible 
        open={open}
        onOpenChange={setOpen}
        className="w-full"
      >
        <div className="flex items-center justify-between py-2">
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1 p-1 h-auto text-muted-foreground hover:text-foreground"
            >
              {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              <span className="text-xs font-medium">
                Assigned Menu Items ({menuItems.length})
              </span>
            </Button>
          </CollapsibleTrigger>
          <Sheet>
            <SheetTrigger asChild>
              <Button size="sm" variant="outline" className="h-7 gap-1">
                <Plus className="h-3.5 w-3.5" />
                Assign Menu Item
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Assign Menu Items to {sessionName}</SheetTitle>
              </SheetHeader>
              
              <div className="mt-6 space-y-4">
                <MenuItemSelector 
                  allItems={allMenuItems} 
                  selectedItems={selectedItems}
                  setSelectedItems={setSelectedItems}
                  excludeIds={menuItems.map(item => item.id)}
                />
                
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedItems([])}
                  >
                    Clear
                  </Button>
                  <Button onClick={handleAssignItems}>
                    Assign ({selectedItems.length})
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        <CollapsibleContent className="pt-1">
          {menuItems.length > 0 ? (
            <ScrollArea className="max-h-64 overflow-auto">
              <div className="space-y-1">
                {menuItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex justify-between items-center p-2 bg-muted/30 rounded text-sm hover:bg-muted/50"
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.name}</span>
                        {item.popular && (
                          <Badge variant="secondary" className="bg-amber-100 text-amber-800 text-[10px] h-4">
                            Popular
                          </Badge>
                        )}
                        {item.vegetarian && (
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 text-[10px] h-4">
                            Veg
                          </Badge>
                        )}
                        {!item.vegetarian && (
                          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 text-[10px] h-4">
                            Non-Veg
                          </Badge>
                        )}
                      </div>
                      
                      <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-2 mt-0.5">
                        <span>{item.category}</span>
                        <span>·</span>
                        <span>${item.price.toFixed(2)}</span>
                        
                        {item.allergens && item.allergens.length > 0 && (
                          <>
                            <span>·</span>
                            <span>
                              Allergens: {item.allergens.slice(0, 2).join(', ')}
                              {item.allergens.length > 2 && ` +${item.allergens.length - 2} more`}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => onEditItem(item)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-4 text-sm text-muted-foreground">
              No menu items assigned to this session
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
