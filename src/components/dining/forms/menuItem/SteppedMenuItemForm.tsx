import React, { useState, useEffect } from "react";
import { MenuItem } from "@/types/menuTypes";
import { useUserRole } from "@/providers/UserRoleProvider";
import { useFranchiseSelector } from "@/hooks/useFranchiseSelector";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Check, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { MultiSelectSessionsCard } from "./MultiSelectSessionsCard";

interface SteppedMenuItemFormProps {
  menuItem?: MenuItem;
  onSave: (menuItem: MenuItem) => void;
  onCancel: () => void;
  onDelete?: (menuItemId: string) => void;
  selectedSessions: string[];
  setSelectedSessions: (sessions: string[]) => void;
  availableSessions: any[];
}

const MENU_CATEGORIES: string[] = [
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

export function SteppedMenuItemForm({
  menuItem,
  onSave,
  onCancel,
  onDelete,
  selectedSessions,
  setSelectedSessions,
  availableSessions
}: SteppedMenuItemFormProps) {
  const { currentUser } = useUserRole();
  const { franchises, selectedFranchiseId, isSuperAdmin } = useFranchiseSelector();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
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
  const [currentStep, setCurrentStep] = useState(0);

  // Initialize sessions when editing an existing menu item
  useEffect(() => {
    if (menuItem?.id && menuItem.sessions && availableSessions.length > 0) {
      const sessionIds = menuItem.sessions.map(sessionName => {
        const session = availableSessions.find(s => s.name === sessionName);
        return session ? session.id : null;
      }).filter(Boolean) as string[];
      
      setSelectedSessions(sessionIds);
    }
  }, [menuItem, availableSessions, setSelectedSessions]);

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

  // Validate the current step
  const validateStep = (step: number): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (step === 0) {
      // Validate details step
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
    }
    
    if (step === 2) {
      // Validate session step
      if (selectedSessions.length === 0) {
        errors.sessions = "Please assign the item to at least one session";
        toast.error("Please assign the menu item to at least one session");
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle step navigation
  const goToNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Final validation before submission
      if (!validateStep(0) || !validateStep(2)) {
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

      // Convert session IDs back to session names for storage
      const sessionNames = selectedSessions.map(sessionId => {
        const session = availableSessions.find(s => s.id === sessionId);
        return session ? session.name : null;
      }).filter(Boolean) as string[];
      
      // Update the menu item with the session names
      const updatedMenuItem = {
        ...menuItemData,
        sessions: sessionNames
      } as MenuItem;
      
      // Send to parent component for saving
      onSave(updatedMenuItem);
      toast.success(`Menu item ${menuItem?.id ? 'updated' : 'added'} successfully!`);
      
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

  // Render the current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
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
                {validationErrors.franchise && (
                  <p className="text-sm text-[#FF4F4F] mt-1">{validationErrors.franchise}</p>
                )}
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
                className={validationErrors.name ? "border-[#FF4F4F]" : ""}
              />
              {validationErrors.name && (
                <p className="text-sm text-[#FF4F4F] mt-1">{validationErrors.name}</p>
              )}
            </div>
            
            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category" className={validationErrors.category ? "border-[#FF4F4F]" : ""}>
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
              {validationErrors.category && (
                <p className="text-sm text-[#FF4F4F] mt-1">{validationErrors.category}</p>
              )}
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
                  className={`pl-7 ${validationErrors.price ? "border-[#FF4F4F]" : ""}`}
                  value={price} 
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              {validationErrors.price && (
                <p className="text-sm text-[#FF4F4F] mt-1">{validationErrors.price}</p>
              )}
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
            <div className="flex items-center justify-between pt-2 border-t border-[#2E2E2E]">
              <Label htmlFor="popular" className="cursor-pointer">Mark as Popular Item</Label>
              <Switch 
                id="popular" 
                checked={popular} 
                onCheckedChange={setPopular} 
              />
            </div>
            
            {/* Image Upload */}
            <div className="space-y-2 pt-2">
              <Label htmlFor="image">Item Image</Label>
              <div className="mt-2">
                {!imagePreview ? (
                  <div className="flex items-center">
                    <Label 
                      htmlFor="image-upload" 
                      className="cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent/50"
                    >
                      <Upload className="w-4 h-4" />
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
                      <span>×</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      
      case 1:
        return (
          <div className="space-y-4">
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
            <div className="space-y-2 pt-4 border-t border-[#2E2E2E]">
              <Label className="block mb-2">Allergens</Label>
              <div className="flex flex-wrap gap-2">
                {ALLERGENS.map((allergen) => {
                  const isSelected = selectedAllergens.includes(allergen);
                  return (
                    <Badge 
                      key={allergen}
                      variant={isSelected ? "default" : "outline"}
                      className={`cursor-pointer ${isSelected ? 'bg-[#7B61FF] hover:bg-[#7B61FF]/90' : 'hover:bg-[#7B61FF]/10'}`}
                      onClick={() => toggleAllergen(allergen)}
                    >
                      {allergen}
                      {isSelected && (
                        <span className="ml-1">×</span>
                      )}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <Label className="block">Assign To Sessions *</Label>
            
            <MultiSelectSessionsCard 
              availableSessions={availableSessions}
              selectedSessions={selectedSessions}
              setSelectedSessions={setSelectedSessions}
            />
            
            {selectedSessions.length === 0 && (
              <div className="p-3 border border-[#FF4F4F] bg-[#FF4F4F]/10 rounded-lg mt-2 text-sm">
                <p className="text-[#FF4F4F] font-medium">
                  Please assign this menu item to at least one session before saving.
                </p>
              </div>
            )}
            
            {selectedSessions.length > 0 && (
              <div className="space-y-2 mt-4">
                <Label className="block">Sessions Preview</Label>
                <div className="p-4 border rounded-lg bg-background">
                  <h4 className="text-sm font-medium mb-2">This menu item will appear in:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSessions.map(sessionId => {
                      const session = availableSessions.find(s => s.id === sessionId);
                      return session ? (
                        <Badge key={sessionId} className="bg-[#7B61FF]">
                          {session.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
            )}
            
            <div className="p-3 border border-[#2E2E2E] bg-black/10 rounded-lg mt-4 text-sm">
              <p>
                <span className="font-medium">Note:</span> Items must be assigned to at least one session.
                You can later control availability for each session individually.
              </p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-[540px] mx-auto p-0">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-semibold">{menuItem ? "Edit Menu Item" : "Add New Menu Item"}</h2>
      </div>
      
      {/* Step indicator */}
      <div className="mb-8">
        <div className="flex justify-center gap-4">
          {[0, 1, 2].map((step) => (
            <div 
              key={step} 
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                currentStep === step 
                  ? 'border-[#7B61FF] bg-[#7B61FF] text-white' 
                  : currentStep > step
                  ? 'border-[#7B61FF] bg-[#7B61FF]/20 text-[#7B61FF]'
                  : 'border-gray-300 bg-transparent text-gray-500'
              }`}
            >
              {step + 1}
            </div>
          ))}
        </div>
        
        <div className="flex justify-between mt-2 text-sm px-4">
          <span className={`${currentStep === 0 ? 'text-[#7B61FF] font-medium' : 'text-gray-500'}`}>
            Item Details
          </span>
          <span className={`${currentStep === 1 ? 'text-[#7B61FF] font-medium' : 'text-gray-500'}`}>
            Dietary Info
          </span>
          <span className={`${currentStep === 2 ? 'text-[#7B61FF] font-medium' : 'text-gray-500'}`}>
            Session Assignment
          </span>
        </div>
      </div>
      
      <Card className="border border-[#2E2E2E] shadow-lg">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step content */}
            <div className="min-h-[320px]">
              {renderStepContent()}
            </div>
            
            {/* Navigation buttons */}
            <div className="flex justify-between pt-4 border-t border-[#2E2E2E]">
              <div>
                {menuItem?.id && onDelete && currentStep === 0 && (
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
                
                {currentStep > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goToPrevStep}
                    disabled={isSubmitting}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                )}
              </div>
              
              <div className="flex gap-2">
                {currentStep === 0 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onCancel}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                )}
                
                {currentStep < 2 ? (
                  <Button 
                    type="button"
                    onClick={goToNextStep}
                    disabled={isSubmitting}
                    className="bg-[#7B61FF] hover:bg-[#7B61FF]/90"
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    type="submit"
                    className="bg-[#7B61FF] hover:bg-[#7B61FF]/90"
                    disabled={isSubmitting || selectedSessions.length === 0}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        {menuItem?.id ? "Update Item" : "Add Item"}
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
