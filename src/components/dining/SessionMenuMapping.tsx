
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserRole } from "@/providers/UserRoleProvider";
import { useFranchiseSelector } from "@/hooks/useFranchiseSelector";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { getSessionMenuItems, updateMenuItemAvailability } from "@/services/menuItemService";
import { MenuItem } from "@/types/menuTypes";
import { Eye, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

interface SessionMenuMappingProps {
  sessions: any[];
}

export function SessionMenuMapping({ sessions }: SessionMenuMappingProps) {
  const { currentUser } = useUserRole();
  const { selectedFranchiseId } = useFranchiseSelector();
  
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [previewMode, setPreviewMode] = useState(false);
  
  // Load menu items when session selection changes
  useEffect(() => {
    if (!selectedSessionId) {
      setMenuItems([]);
      return;
    }
    
    const fetchMenuItems = async () => {
      setIsLoading(true);
      try {
        const items = await getSessionMenuItems(selectedSessionId);
        setMenuItems(items || []);
      } catch (error) {
        console.error("Error loading menu items:", error);
        toast.error("Failed to load menu items");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMenuItems();
  }, [selectedSessionId]);
  
  // Filter menu items
  const filteredMenuItems = menuItems.filter(item => {
    // Filter by search query
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by type
    let matchesType = true;
    switch (filterType) {
      case "vegetarian":
        matchesType = item.vegetarian === true;
        break;
      case "non-vegetarian":
        matchesType = item.vegetarian === false;
        break;
      case "gluten-free":
        matchesType = item.gluten_free === true;
        break;
      case "dairy-free":
        matchesType = item.dairy_free === true;
        break;
      case "popular":
        matchesType = item.popular === true;
        break;
      default:
        matchesType = true;
    }
    
    return matchesSearch && matchesType;
  });

  // Toggle item availability
  const toggleAvailability = async (menuItemId: string | number, currentAvailability: boolean) => {
    try {
      await updateMenuItemAvailability(menuItemId.toString(), selectedSessionId, !currentAvailability);
      
      // Update local state
      setMenuItems(menuItems.map(item => {
        if (item.id === menuItemId) {
          return { ...item, available: !currentAvailability };
        }
        return item;
      }));
      
      toast.success(`Item ${!currentAvailability ? 'added to' : 'removed from'} menu`);
    } catch (error) {
      console.error("Error updating availability:", error);
      toast.error("Failed to update menu item availability");
    }
  };

  // Find the selected session
  const selectedSession = sessions.find(session => session.id === selectedSessionId);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Session Menu Mapping</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid gap-6">
          {/* Session Selection */}
          <div>
            <Label htmlFor="session-selector">Select Session</Label>
            <Select 
              value={selectedSessionId} 
              onValueChange={setSelectedSessionId}
            >
              <SelectTrigger id="session-selector">
                <SelectValue placeholder="Choose a session" />
              </SelectTrigger>
              <SelectContent>
                {sessions.map(session => (
                  <SelectItem key={session.id} value={session.id}>
                    {session.name} - {session.start_date}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedSessionId && (
            <>
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Configure menu items for <strong>{selectedSession?.name}</strong>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    id="preview-mode"
                    checked={previewMode}
                    onCheckedChange={setPreviewMode}
                  />
                  <Label htmlFor="preview-mode" className="cursor-pointer flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    Guest View
                  </Label>
                </div>
              </div>
              
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search menu items..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[180px]">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <span>Filter</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Items</SelectItem>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                    <SelectItem value="gluten-free">Gluten-Free</SelectItem>
                    <SelectItem value="dairy-free">Dairy-Free</SelectItem>
                    <SelectItem value="popular">Popular Items</SelectItem>
                    <SelectItem value="available">Available Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Menu Items Table */}
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Dietary</TableHead>
                      {!previewMode && (
                        <TableHead className="text-right">Available</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                            <span className="ml-2">Loading menu items...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredMenuItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          {menuItems.length === 0 ? (
                            "No menu items assigned to this session yet"
                          ) : (
                            "No menu items match your search criteria"
                          )}
                        </TableCell>
                      </TableRow>
                    ) : (
                      // Show either all items in admin mode or only available items in preview mode
                      filteredMenuItems
                        .filter(item => !previewMode || item.available)
                        .map(item => (
                          <TableRow key={item.id} className={previewMode ? "" : "cursor-pointer hover:bg-accent/20"}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-3">
                                {item.image_url && (
                                  <img 
                                    src={item.image_url} 
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
                                {item.allergens?.length > 0 && (
                                  <Badge variant="outline" className="text-amber-600 border-amber-600">
                                    Allergens
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            {!previewMode && (
                              <TableCell className="text-right">
                                <Switch
                                  checked={item.available}
                                  onCheckedChange={() => toggleAvailability(item.id, item.available || false)}
                                />
                              </TableCell>
                            )}
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {/* Guest Preview Message */}
              {previewMode && (
                <div className="bg-muted/50 p-4 rounded-md">
                  <div className="flex items-center gap-2 text-sm">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span>
                      This view shows only items marked as available for guests to see.
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
