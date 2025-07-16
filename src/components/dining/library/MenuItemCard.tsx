
import React from "react";
import { Badge } from "@/components/ui/badge";
import { MenuItem } from "@/types/menuTypes";

interface MenuItemCardProps {
  item: MenuItem;
  viewMode: "grid" | "list";
  renderSessionBadges: (sessions?: string[]) => React.ReactNode;
  onDragStart: (e: React.DragEvent, item: MenuItem) => void;
  onClick: (item: MenuItem) => void;
}

export function MenuItemCard({
  item,
  viewMode,
  renderSessionBadges,
  onDragStart,
  onClick
}: MenuItemCardProps) {
  return (
    <div
      className={`border rounded-lg p-4 cursor-move bg-background hover:bg-muted/20 transition-colors shadow-sm relative ${
        viewMode === 'list' ? 'flex justify-between gap-4 items-center' : ''
      }`}
      draggable
      onDragStart={(e) => onDragStart(e, item)}
      onClick={() => onClick(item)}
    >
      {viewMode === "grid" ? (
        // Grid view layout
        <>
          <div className="flex justify-between items-center mb-2.5">
            <h3 className="font-medium text-base">{item.name}</h3>
            <span className="text-sm font-medium">${item.price.toFixed(2)}</span>
          </div>
          
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            <Badge variant="outline" className="bg-gray-100 text-xs">{item.category}</Badge>
            {item.vegetarian ? (
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 text-xs">
                Veg
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 text-xs">
                Non-Veg
              </Badge>
            )}
            {item.popular && (
              <Badge className="bg-amber-500 text-white border-amber-600 text-xs">
                Popular
              </Badge>
            )}
          </div>
          
          <div className="mb-3 text-xs text-muted-foreground line-clamp-2">
            {item.description || "No description available"}
          </div>
          
          <div>
            {renderSessionBadges(item.sessions)}
          </div>
        </>
      ) : (
        // List view layout
        <>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium">{item.name}</h3>
              {item.popular && (
                <Badge className="bg-amber-500 text-white border-amber-600 text-xs">
                  Popular
                </Badge>
              )}
            </div>
            <div className="text-xs text-muted-foreground line-clamp-1 mb-1.5">
              {item.description || "No description available"}
            </div>
            <div>
              {renderSessionBadges(item.sessions)}
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-gray-100">{item.category}</Badge>
              {item.vegetarian ? (
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                  Veg
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                  Non-Veg
                </Badge>
              )}
              <span className="text-sm font-medium ml-1">${item.price.toFixed(2)}</span>
            </div>
          </div>
        </>
      )}
      
      <div className="absolute inset-0 rounded-lg pointer-events-none border-2 border-transparent hover:border-[#7B61FF]/50 transition-colors"></div>
    </div>
  );
}
