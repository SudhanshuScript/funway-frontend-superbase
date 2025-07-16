
import React, { useState, useEffect } from "react";
import { useUserRole } from "@/providers/UserRoleProvider";
import { useFranchiseSelector } from "@/hooks/useFranchiseSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SessionMultiSelect } from "./SessionMultiSelect";
import { MenuItem, MenuItemCategory } from "@/types/menuTypes";
import { Check, Image, Loader2, X, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface MenuItemFormProps {
  menuItem?: MenuItem;
  onSave: (menuItem: MenuItem) => void;
  onCancel: () => void;
  onDelete?: (menuItemId: string) => void;
  selectedSessions: string[];
  setSelectedSessions: (sessions: string[]) => void;
  availableSessions: any[];
}

const MENU_CATEGORIES: MenuItemCategory[] = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Dessert',
  'Special'
];

const ALLERGENS = [
  'Eggs',
  'Fish',
  'Milk',
  'Peanuts',
  'Shellfish',
  'Soy',
  'Tree Nuts',
  'Wheat'
];

export function MenuItemForm({
  menuItem,
  onSave,
  onCancel,
  onDelete,
  selectedSessions,
  setSelectedSessions,
  availableSessions
}: MenuItemFormProps) {
  const { currentUser } = useUserRole();
  const { franchises, selectedFranchiseId, handleFranchiseChange, isSuperAdmin } = useFranchiseSelector();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Track visited tabs to ensure all are reviewed before submission
  const [activeTab, setActiveTab] = useState("details");
  const [visitedTabs, setVisitedTabs] = useState<{[key: string]: boolean}>({
    details: true, // Details tab is visited by default
    dietary: false,
    sessions: false
  });
  const [allTabsVisited, setAllTabsVisited] = useState(false);
  
  // Form state
  const [name, setName] = useState(menuItem?.name || "");
  const [description, setDescription] = useState(menuItem?.description || "");
  const [price, setPrice] = useState(menuItem?.price?.toString() || "");
  const [category, setCategory] = useState<string>(menuItem?.category || "Lunch");
  const [vegetarian, setVegetarian] = useState(menuItem?.vegetarian || false);
  const [glutenFree, setGlutenFree] = useState(menuItem?.gluten_free || false);
  const [dairyFree, setDairyFree] = useState(menuItem?.dairy_free || false);
  const [popular, setPopular] = useState(menuItem?.popular || false);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>(menuItem?.allergens || []);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(menuItem?.image_url || "");
  const [selectedFranchise, setSelectedFranchise] = useState<string>(
    menuItem?.franchise_id || currentUser?.franchiseId || selectedFranchiseId
  );
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  // If it's an existing menu item, mark all tabs as visited
  useEffect(() => {
    if (menuItem?.id) {
      setVisitedTabs({
        details: true,
        dietary: true,
        sessions: true
      });
    }
  }, [menuItem]);

  // Update all tabs visited state when visitedTabs changes
  useEffect(() => {
    const allVisited = Object.values(visitedTabs).every(visited => visited);
    setAllTabsVisited(allVisited);
  }, [visitedTabs]);

  // Handle tab change to track visited tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setVisitedTabs(prev => ({
      ...prev,
      [value]: true
    }));
  };

  // Handle franchise change for superadmin
  useEffect(() => {
    if (isSuperAdmin && !menuItem?.franchise_id) {
      setSelectedFranchise(selectedFranchiseId !== 'all' ? selectedFranchiseId : franchises[0]?.id || '');
    }
  }, [selectedFranchiseId, franchises, isSuperAdmin, menuItem?.franchise_id]);

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(menuItem?.image_url || "");
  };

  // Toggle allergen
  const toggleAllergen = (allergen: string) => {
    if (selectedAllergens.includes(allergen)) {
      setSelectedAllergens(selectedAllergens.filter(a => a !== allergen));
    } else {
      setSelectedAllergens([...selectedAllergens, allergen]);
    }
  };

  // Form validation
  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!name.trim()) {
      errors.name = "Menu item name is required";
    }
    
    if (!category) {
      errors.category = "Category is required";
    }
    
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) < 0) {
      errors.price = "Please enter a valid price";
    }
    
    if (isSuperAdmin && !selectedFranchise) {
      errors.franchise = "Please select a franchise";
    }
    
    // Validate sessions tab
    if (selectedSessions.length === 0) {
      errors.sessions = "Please assign the item to at least one session";
      toast.error("Please assign the menu item to at least one session");
      setActiveTab("sessions"); // Switch to sessions tab to highlight the issue
      return false;
    }
    
    // Only validate tab visits if it's a new item (existing items are assumed to have been reviewed)
    if (!menuItem?.id) {
      // Validate that all tabs have been visited
      if (!allTabsVisited) {
        errors.tabs = "Please review all tabs before submitting";
        
        // Specifically identify which tabs need review
        const tabMessages = [];
        if (!visitedTabs.dietary) tabMessages.push("Dietary Info");
        if (!visitedTabs.sessions) tabMessages.push("Session Assignment");
        
        if (tabMessages.length > 0) {
          toast.error(`Please review the following tabs before saving: ${tabMessages.join(", ")}`);
          return false;
        }
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Validate form
      if (!validateForm()) {
        setIsSubmitting(false);
        return;
      }
      
      // Process image upload if needed
      let imageUrl = menuItem?.image_url || "";
      if (imageFile) {
        try {
          const franchiseId = selectedFranchise || currentUser?.franchiseId || "";
          // In a real app, we would upload the image here
          // imageUrl = await uploadMenuItemImage(imageFile, franchiseId);
          console.log("Image upload would happen here:", imageFile.name);
          imageUrl = URL.createObjectURL(imageFile); // Just for demo purposes
        } catch (imageError) {
          console.error("Image upload failed:", imageError);
          toast.error("Failed to upload image, but continuing with menu item save");
          // Continue without image
        }
      }
      
      // Prepare menu item data
      const menuItemData: Partial<MenuItem> = {
        name,
        description,
        category,
        price: parseFloat(price),
        vegetarian,
        gluten_free: glutenFree,
        dairy_free: dairyFree,
        popular,
        allergens: selectedAllergens,
        franchise_id: selectedFranchise || currentUser?.franchiseId,
      };
      
      if (menuItem?.id) {
        menuItemData.id = menuItem.id;
      }
      
      if (imageUrl) {
        menuItemData.image_url = imageUrl;
      }
      
      console.log("Submitting menu item:", menuItemData);
      console.log("With selected sessions:", selectedSessions);
      
      // Send to parent component for saving
      onSave(menuItemData as MenuItem);
      
    } catch (error) {
      console.error("Error in form submission:", error);
      toast.error("Failed to save menu item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle menu item deletion
  const handleDelete = async () => {
    if (!menuItem?.id || !onDelete) return;
    
    try {
      setIsDeleting(true);
      onDelete(menuItem.id);
    } catch (error) {
      console.error("Error deleting menu item:", error);
      toast.error("Failed to delete menu item");
      setIsDeleting(false);
    }
  };

  // Show visual indicators for tabs that need review
  const getTabIndicator = (tabName: string) => {
    if (visitedTabs[tabName]) {
      return <Check className="h-4 w-4 text-green-500" />;
    }
    return <AlertCircle className="h-4 w-4 text-amber-500" />;
  };

  return (
    <Card className="shadow-md border-t-4 border-t-primary">
      <CardHeader>
        <CardTitle>{menuItem ? "Edit Menu Item" : "Add New Menu Item"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="details" value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="mb-4 grid grid-cols-3">
              <TabsTrigger value="details" className="flex items-center gap-2">
                Item Details
                {getTabIndicator('details')}
              </TabsTrigger>
              <TabsTrigger value="dietary" className="flex items-center gap-2">
                Dietary Info
                {getTabIndicator('dietary')}
              </TabsTrigger>
              <TabsTrigger value="sessions" className="flex items-center gap-2">
                Session Assignment
                {getTabIndicator('sessions')}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4">
              {/* Franchise Selection (Superadmin Only) */}
              {isSuperAdmin && (
                <div className="space-y-2">
                  <Label htmlFor="franchise">Franchise</Label>
                  <Select 
                    value={selectedFranchise} 
                    onValueChange={setSelectedFranchise}
                  >
                    <SelectTrigger id="franchise">
                      <SelectValue placeholder="Select a franchise" />
                    </SelectTrigger>
                    <SelectContent>
                      {franchises.map((franchise) => (
                        <SelectItem key={franchise.id} value={franchise.id}>
                          {franchise.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {/* Menu Item Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Item Name *</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Enter item name"
                  required
                />
              </div>
              
              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {MENU_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5">$</span>
                  <Input 
                    id="price" 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    className="pl-7"
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              
              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the menu item"
                  rows={3}
                />
              </div>
              
              {/* Popular Item Toggle */}
              <div className="flex items-center justify-between">
                <Label htmlFor="popular" className="cursor-pointer">Mark as Popular Item</Label>
                <Switch 
                  id="popular" 
                  checked={popular} 
                  onCheckedChange={setPopular} 
                />
              </div>
              
              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="image">Item Image</Label>
                <div className="mt-2">
                  {!imagePreview ? (
                    <div className="flex items-center">
                      <Label 
                        htmlFor="image-upload" 
                        className="cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent/50"
                      >
                        <Image className="w-4 h-4" />
                        Upload Image
                      </Label>
                      <Input 
                        id="image-upload" 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange}
                        className="hidden" 
                      />
                    </div>
                  ) : (
                    <div className="relative w-40 h-40 rounded-md overflow-hidden">
                      <img 
                        src={imagePreview} 
                        alt={name || "Menu item"} 
                        className="w-full h-full object-cover" 
                      />
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="icon" 
                        className="absolute top-2 right-2 h-6 w-6 rounded-full"
                        onClick={removeImage}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="dietary" className="space-y-4">
              {/* Dietary Toggles */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="vegetarian" className="cursor-pointer">Vegetarian</Label>
                  <Switch 
                    id="vegetarian" 
                    checked={vegetarian} 
                    onCheckedChange={setVegetarian} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="gluten-free" className="cursor-pointer">Gluten-Free</Label>
                  <Switch 
                    id="gluten-free" 
                    checked={glutenFree} 
                    onCheckedChange={setGlutenFree} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="dairy-free" className="cursor-pointer">Dairy-Free</Label>
                  <Switch 
                    id="dairy-free" 
                    checked={dairyFree} 
                    onCheckedChange={setDairyFree} 
                  />
                </div>
              </div>
              
              {/* Allergens */}
              <div className="space-y-2">
                <Label className="block mb-2">Allergens</Label>
                <div className="flex flex-wrap gap-2">
                  {ALLERGENS.map((allergen) => {
                    const isSelected = selectedAllergens.includes(allergen);
                    return (
                      <Badge 
                        key={allergen}
                        variant={isSelected ? "default" : "outline"}
                        className={`cursor-pointer ${isSelected ? 'bg-amber-500 hover:bg-amber-600' : 'hover:bg-amber-100'}`}
                        onClick={() => toggleAllergen(allergen)}
                      >
                        {allergen}
                        {isSelected && (
                          <X className="ml-1 h-3 w-3" />
                        )}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="sessions" className="space-y-4">
              <Label className="block">Assign To Sessions *</Label>
              <SessionMultiSelect
                availableSessions={availableSessions}
                selectedSessions={selectedSessions}
                setSelectedSessions={setSelectedSessions}
              />
              
              <div className="text-sm text-muted-foreground mt-2">
                <p>
                  <span className="font-medium">Note:</span> Items must be assigned to at least one session.
                  You can later control availability for each session individually.
                </p>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between pt-4 border-t">
            <div>
              {menuItem?.id && onDelete && (
                <Button 
                  type="button" 
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isSubmitting || isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Item"
                  )}
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                disabled={isSubmitting || isDeleting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting || isDeleting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : menuItem?.id ? "Update Item" : "Add Item"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
