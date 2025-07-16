
import React, { useState } from "react";
import { MenuItem } from "@/types/menuTypes";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Edit, Trash2, Search, Filter, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MenuItemsViewProps {
  menuItems: MenuItem[];
  onSelectMenuItem: (item: MenuItem) => void;
  isLoading: boolean;
}

export function MenuItemsView({
  menuItems,
  onSelectMenuItem,
  isLoading,
}: MenuItemsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Get unique categories from menu items
  const categories = [...new Set(menuItems.map((item) => item.category))];

  // Filter menu items based on search and category
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description &&
        item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Session badge renderer with tooltip
  const renderSessionBadges = (sessions?: string[]) => {
    if (!sessions || sessions.length === 0) return null;

    // Only show first 2 badges + count if more
    const displayedSessions = sessions.slice(0, 2);
    const remainingCount = sessions.length - displayedSessions.length;

    return (
      <div className="flex flex-wrap gap-1">
        {displayedSessions.map((session) => (
          <Badge
            key={session}
            variant="outline"
            className="bg-[#7B61FF]/10 text-[#7B61FF] border-[#7B61FF]/30"
          >
            {session}
          </Badge>
        ))}
        {remainingCount > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className="bg-gray-100 text-gray-700 border-gray-300 cursor-help"
                >
                  +{remainingCount} more
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1">
                  <p className="text-xs font-medium">Additional Sessions:</p>
                  <ul className="text-xs">
                    {sessions.slice(2).map((session) => (
                      <li key={session}>{session}</li>
                    ))}
                  </ul>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    );
  };

  // Render allergen badges with tooltip
  const renderAllergenBadges = (allergens?: string[]) => {
    if (!allergens || allergens.length === 0) return null;

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-flex items-center text-xs text-amber-600">
              <AlertCircle className="h-3 w-3 mr-1" />
              {allergens.length} allergen{allergens.length !== 1 && 's'}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1">
              <p className="text-xs font-medium">Allergens:</p>
              <div className="flex flex-wrap gap-1">
                {allergens.map((allergen) => (
                  <Badge key={allergen} variant="outline" className="text-xs bg-amber-100 text-amber-800 border-amber-200">
                    {allergen}
                  </Badge>
                ))}
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div>
      {/* Search and Filter Controls */}
      <div className="p-4 border-b border-[#2A2A2A] flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Menu Items Table */}
      <ScrollArea className="h-[500px]">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead className="w-[250px]">Item Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead>Dietary</TableHead>
              <TableHead>Sessions</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7B61FF]"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Loading menu items...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-muted-foreground">No menu items found</p>
                    {(searchQuery || categoryFilter !== "all") && (
                      <Button
                        variant="link"
                        onClick={() => {
                          setSearchQuery("");
                          setCategoryFilter("all");
                        }}
                        className="mt-2"
                      >
                        Clear filters
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow
                  key={item.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onSelectMenuItem(item)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {item.name}
                      {item.popular && (
                        <Badge className="bg-amber-500 text-white text-xs">Popular</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge
                        variant="outline"
                        className={`w-fit ${
                          item.vegetarian
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-red-100 text-red-800 border-red-200"
                        }`}
                      >
                        {item.vegetarian ? "Vegetarian" : "Non-Veg"}
                      </Badge>
                      {item.allergens && item.allergens.length > 0 && (
                        <div>{renderAllergenBadges(item.allergens)}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="cursor-pointer">
                            {renderSessionBadges(item.sessions)}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          Click to edit session assignments
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectMenuItem(item);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Delete functionality handled in the modal
                          onSelectMenuItem(item);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
