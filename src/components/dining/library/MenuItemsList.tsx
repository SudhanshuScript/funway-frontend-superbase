
import React, { useState } from "react";
import { MenuItem } from "@/types/menuTypes";
import { Badge } from "@/components/ui/badge";
import { Pencil, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MenuItemsListProps {
  filteredMenuItems: MenuItem[];
  viewMode: "grid" | "list";
  renderSessionBadges: (sessions?: string[]) => React.ReactNode;
  handleDragStart: (e: React.DragEvent, item: MenuItem) => void;
  onSelectMenuItem: (item: MenuItem) => void;
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: string) => void;
  sessionAssignments?: Record<string, string[]>; // Menu ID -> Session IDs
}

export function MenuItemsList({ 
  filteredMenuItems,
  viewMode,
  renderSessionBadges,
  handleDragStart,
  onSelectMenuItem,
  setSearchQuery,
  setCategoryFilter,
  sessionAssignments = {}
}: MenuItemsListProps) {
  // Track if item is being dragged
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

  return (
    <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
      {filteredMenuItems.length === 0 ? (
        <div className="col-span-full text-center py-8 text-muted-foreground">
          No menu items found matching your criteria.
        </div>
      ) : (
        filteredMenuItems.map(item => (
          <div
            key={item.id}
            className={`${
              viewMode === "grid" 
                ? "bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all" 
                : "flex items-center gap-4 border rounded-lg p-3 hover:bg-accent/5"
            } ${draggedItemId === item.id ? 'opacity-50' : 'opacity-100'}
              cursor-grab active:cursor-grabbing`
            }
            draggable
            onDragStart={(e) => {
              handleDragStart(e, item);
              setDraggedItemId(item.id);
              // Set a custom drag image if needed
              if (viewMode === "grid" && e.currentTarget.firstElementChild) {
                const img = e.currentTarget.firstElementChild as HTMLElement;
                e.dataTransfer.setDragImage(img, 20, 20);
              }
            }}
            onDragEnd={() => {
              setDraggedItemId(null);
            }}
            onClick={(e) => {
              // Only trigger click if not dragging
              if (draggedItemId === null) {
                onSelectMenuItem(item);
              }
            }}
          >
            {viewMode === "grid" ? (
              <>
                {item.image_url ? (
                  <div className="h-36 w-full overflow-hidden bg-muted">
                    <img 
                      src={item.image_url} 
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="h-36 w-full bg-gradient-to-br from-muted/80 to-muted flex items-center justify-center">
                    <span className="text-muted-foreground">{item.name.charAt(0)}</span>
                  </div>
                )}
                <div className="p-3">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium text-foreground">{item.name}</h3>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMenuItem(item);
                      }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">{item.category}</span>
                    <span className="font-medium">${item.price?.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    {item.vegetarian && (
                      <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 text-[10px]">
                        Vegetarian
                      </Badge>
                    )}
                    {item.popular && (
                      <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200 text-[10px]">
                        Popular
                      </Badge>
                    )}
                    {item.gluten_free && (
                      <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200 text-[10px]">
                        GF
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-xs text-muted-foreground line-clamp-2 h-8">
                    {item.description}
                  </div>
                  
                  <div className="mt-2">
                    {renderSessionBadges(item.sessions)}
                  </div>
                </div>
              </>
            ) : (
              <>
                {item.image_url ? (
                  <div className="h-12 w-12 rounded overflow-hidden bg-muted flex-shrink-0">
                    <img 
                      src={item.image_url} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-12 w-12 rounded bg-muted flex items-center justify-center flex-shrink-0">
                    <span className="text-muted-foreground">{item.name.charAt(0)}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-foreground">{item.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">${item.price?.toFixed(2)}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); 
                          onSelectMenuItem(item);
                        }}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-muted-foreground">{item.category}</span>
                    
                    <div className="flex gap-1">
                      {item.vegetarian && (
                        <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 text-[10px]">
                          Veg
                        </Badge>
                      )}
                      {item.popular && (
                        <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200 text-[10px]">
                          Popular
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-1">
                    {renderSessionBadges(item.sessions)}
                  </div>
                </div>
              </>
            )}
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center rounded-full bg-[#7B61FF]/10 text-[#7B61FF] cursor-help">
                    <Info className="h-3 w-3" />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="text-xs p-2">
                  Drag this item to a session to assign it
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ))
      )}
    </div>
  );
}
