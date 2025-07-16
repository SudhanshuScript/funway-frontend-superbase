
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Leaf, AlertTriangle, Wheat, Milk } from "lucide-react";
import { X } from "lucide-react";

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

interface DietaryTabProps {
  vegetarian: boolean;
  setVegetarian: (vegetarian: boolean) => void;
  glutenFree: boolean;
  setGlutenFree: (glutenFree: boolean) => void;
  dairyFree: boolean;
  setDairyFree: (dairyFree: boolean) => void;
  selectedAllergens: string[];
  setSelectedAllergens: (allergens: string[]) => void;
}

export function DietaryTab({
  vegetarian,
  setVegetarian,
  glutenFree,
  setGlutenFree,
  dairyFree,
  setDairyFree,
  selectedAllergens,
  setSelectedAllergens
}: DietaryTabProps) {
  // Toggle allergen
  const toggleAllergen = (allergen: string) => {
    if (selectedAllergens.includes(allergen)) {
      setSelectedAllergens(selectedAllergens.filter(a => a !== allergen));
    } else {
      setSelectedAllergens([...selectedAllergens, allergen]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Leaf className="h-5 w-5 text-[#7B61FF]" />
        <h3 className="text-lg font-medium">Dietary Information</h3>
      </div>
      
      {/* Dietary Options */}
      <Card className="border border-[#2E2E2E]">
        <div className="p-4 space-y-4">
          <Label className="block text-base mb-3">Dietary Options</Label>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-md border border-[#2E2E2E] hover:bg-[#7B61FF]/5">
              <div className="flex items-center gap-2">
                <div className="bg-green-100 p-2 rounded-full">
                  <Leaf className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <Label htmlFor="vegetarian" className="cursor-pointer font-medium">Vegetarian</Label>
                  <p className="text-xs text-muted-foreground">Contains no meat, poultry or fish</p>
                </div>
              </div>
              <Switch 
                id="vegetarian" 
                checked={vegetarian} 
                onCheckedChange={setVegetarian} 
              />
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-md border border-[#2E2E2E] hover:bg-[#7B61FF]/5">
              <div className="flex items-center gap-2">
                <div className="bg-amber-100 p-2 rounded-full">
                  <Wheat className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <Label htmlFor="gluten-free" className="cursor-pointer font-medium">Gluten-Free</Label>
                  <p className="text-xs text-muted-foreground">Contains no wheat, barley or rye</p>
                </div>
              </div>
              <Switch 
                id="gluten-free" 
                checked={glutenFree} 
                onCheckedChange={setGlutenFree} 
              />
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-md border border-[#2E2E2E] hover:bg-[#7B61FF]/5">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Milk className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <Label htmlFor="dairy-free" className="cursor-pointer font-medium">Dairy-Free</Label>
                  <p className="text-xs text-muted-foreground">Contains no milk, cheese or other dairy products</p>
                </div>
              </div>
              <Switch 
                id="dairy-free" 
                checked={dairyFree} 
                onCheckedChange={setDairyFree} 
              />
            </div>
          </div>
        </div>
      </Card>
      
      {/* Allergens */}
      <Card className="border border-[#2E2E2E]">
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <Label className="block text-base">Allergens</Label>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {ALLERGENS.map((allergen) => {
              const isSelected = selectedAllergens.includes(allergen);
              return (
                <Badge 
                  key={allergen}
                  variant={isSelected ? "default" : "outline"}
                  className={`cursor-pointer px-3 py-1 ${
                    isSelected 
                      ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                      : 'hover:bg-amber-100 hover:text-amber-800'
                  }`}
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
          
          <div className="text-xs text-muted-foreground mt-2">
            Click allergens to select or deselect them. Selected allergens will be highlighted on the menu for customers with allergies.
          </div>
        </div>
      </Card>
    </div>
  );
}
