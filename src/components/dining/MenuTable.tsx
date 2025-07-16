
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Star, Trash2 } from "lucide-react";
import { MenuItem } from "@/types/menuTypes";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MenuTableProps {
  menuItems: MenuItem[];
  onSelectMenuItem: (item: MenuItem) => void;
  renderSessionBadges: (sessions?: string[]) => React.ReactNode;
  isLoading?: boolean;
}

export function MenuTable({ menuItems, onSelectMenuItem, renderSessionBadges, isLoading = false }: MenuTableProps) {
  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="text-sm text-muted-foreground">Loading menu items...</span>
          </div>
        </div>
      )}
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Dietary</TableHead>
            <TableHead>Popular</TableHead>
            <TableHead>Assigned Sessions</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {menuItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                {isLoading ? (
                  <span className="text-muted-foreground">Loading menu items...</span>
                ) : (
                  <span className="text-muted-foreground">No menu items found.</span>
                )}
              </TableCell>
            </TableRow>
          ) : (
            menuItems.map((item) => (
              <TableRow 
                key={item.id}
                className="cursor-pointer"
                onClick={() => onSelectMenuItem(item)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    {item.image_url && (
                      <img 
                        src={typeof item.image_url === 'string' ? item.image_url : ''}
                        alt={item.name} 
                        className="h-10 w-10 rounded object-cover"
                      />
                    )}
                    <div>
                      <div>{item.name}</div>
                      {item.description && (
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>${item.price.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {item.vegetarian && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Veg
                      </Badge>
                    )}
                    {item.gluten_free && (
                      <Badge variant="outline" className="text-purple-600 border-purple-600">
                        GF
                      </Badge>
                    )}
                    {item.dairy_free && (
                      <Badge variant="outline" className="text-blue-600 border-blue-600">
                        DF
                      </Badge>
                    )}
                    {item.allergens.length > 0 && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                              Allergens
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-xs">
                              <p className="font-semibold mb-1">Allergens:</p>
                              <ul className="list-disc pl-4">
                                {item.allergens.map((allergen, i) => (
                                  <li key={i}>{allergen}</li>
                                ))}
                              </ul>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {item.popular ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-xs">
                            Popular Item
                            {item.satisfaction_score && (
                              <div>
                                Guest satisfaction: {item.satisfaction_score}/5
                              </div>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {renderSessionBadges(item.sessions)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={(e) => {
                      e.stopPropagation();
                      onSelectMenuItem(item);
                    }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
