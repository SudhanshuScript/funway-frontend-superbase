import React, { useState, useEffect } from "react";
import { MenuItem } from "@/types/menuTypes";
import { useUserRole } from "@/providers/UserRoleProvider";
import { useFranchiseSelector } from "@/hooks/useFranchiseSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { DetailsTab } from "./DetailsTab";
import { DietaryTab } from "./DietaryTab";
import { SessionsTab } from "./SessionsTab";
import { validateMenuItemForm } from "./menuItemValidation";

interface MenuItemFormProps {
  menuItem?: MenuItem;
  onSave: (menuItem: MenuItem) => void;
  onCancel: () => void;
  onDelete?: (menuItemId: string) => void;
  selectedSessions: string[];
  setSelectedSessions: (sessions: string[]) => void;
  availableSessions: any[];
}

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
  const { franchises, selectedFranchiseId, isSuperAdmin } = useFranchiseSelector();
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
      setAllTabsVisited(true);
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
    
    // If switching to sessions tab and no sessions are selected,
    // remind the user that at least one session must be selected
    if (value === "sessions" && selectedSessions.length === 0) {
      console.log("No sessions selected yet");
    }
  };

  // Handle franchise change for superadmin
  useEffect(() => {
    if (isSuperAdmin && !menuItem?.franchise_id) {
      setSelectedFranchise(selectedFranchiseId !== 'all' ? selectedFranchiseId : franchises[0]?.id || '');
    }
  }, [selectedFranchiseId, franchises, isSuperAdmin, menuItem?.franchise_id]);

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
        image_url: imagePreview, // Set the preview URL for display
      };
      
      // Add the image file if it exists for upload
      if (imageFile) {
        menuItemData.image_file = imageFile;
      }
      
      if (menuItem?.id) {
        menuItemData.id = menuItem.id;
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

  // Helper function to validate form
  const validateForm = () => {
    const validation = validateMenuItemForm(
      name,
      category,
      price,
      selectedFranchise,
      isSuperAdmin,
      selectedSessions,
      visitedTabs,
      allTabsVisited
    );
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return false;
    }
    
    return true;
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

  // Check sessions status
  const hasSelectedSessions = selectedSessions.length > 0;

  return (
    <Card className="shadow-md border-t-4 border-t-[#7B61FF]">
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
                {!hasSelectedSessions && <span className="ml-1 text-red-500">*</span>}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="details">
              <DetailsTab 
                name={name}
                setName={setName}
                description={description}
                setDescription={setDescription}
                price={price}
                setPrice={setPrice}
                category={category}
                setCategory={setCategory}
                popular={popular}
                setPopular={setPopular}
                imageFile={imageFile}
                setImageFile={setImageFile}
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
                selectedFranchise={selectedFranchise}
                setSelectedFranchise={setSelectedFranchise}
                isSuperAdmin={isSuperAdmin}
                menuItemId={menuItem?.id}
              />
            </TabsContent>
            
            <TabsContent value="dietary">
              <DietaryTab 
                vegetarian={vegetarian}
                setVegetarian={setVegetarian}
                glutenFree={glutenFree}
                setGlutenFree={setGlutenFree}
                dairyFree={dairyFree}
                setDairyFree={setDairyFree}
                selectedAllergens={selectedAllergens}
                setSelectedAllergens={setSelectedAllergens}
              />
            </TabsContent>
            
            <TabsContent value="sessions">
              <SessionsTab 
                selectedSessions={selectedSessions}
                setSelectedSessions={setSelectedSessions}
                availableSessions={availableSessions}
              />
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
          
          {/* Display validation hint for sessions */}
          {!hasSelectedSessions && (
            <div className="text-sm text-red-500 mt-2">
              * You must assign this menu item to at least one session before saving.
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
