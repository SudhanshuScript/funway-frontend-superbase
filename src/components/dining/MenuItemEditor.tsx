
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SessionMultiSelect } from "./SessionMultiSelect";
import { MenuItem } from "@/types/menuTypes";

interface MenuItemEditorProps {
  selectedMenuItem: MenuItem | null;
  onCancel: () => void;
  onSave: () => void;
  selectedSessions: string[];
  setSelectedSessions: (sessions: string[]) => void;
  getAvailableSessions: () => any[];
}

export function MenuItemEditor({
  selectedMenuItem,
  onCancel,
  onSave,
  selectedSessions,
  setSelectedSessions,
  getAvailableSessions,
}: MenuItemEditorProps) {
  if (!selectedMenuItem) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Menu Item</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="itemName">Item Name</Label>
            <Input id="itemName" defaultValue={selectedMenuItem.name} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="itemCategory">Category</Label>
            <Input id="itemCategory" defaultValue={selectedMenuItem.category} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="itemPrice">Price ($)</Label>
            <Input id="itemPrice" type="number" step="0.01" defaultValue={selectedMenuItem.price} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="itemAllergens">Allergens</Label>
            <Input id="itemAllergens" defaultValue={selectedMenuItem.allergens.join(", ")} />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="itemDescription">Description</Label>
            <Input id="itemDescription" defaultValue={selectedMenuItem.description} />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="isVegetarian" defaultChecked={selectedMenuItem.vegetarian} />
              <Label htmlFor="isVegetarian">Vegetarian</Label>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="isPopular" defaultChecked={selectedMenuItem.popular} />
              <Label htmlFor="isPopular">Mark as Popular</Label>
            </div>
          </div>
          
          <div className="space-y-3 md:col-span-2">
            <Label>Assign this item to the following sessions:</Label>
            <SessionMultiSelect 
              availableSessions={getAvailableSessions()} 
              selectedSessions={selectedSessions}
              setSelectedSessions={setSelectedSessions}
            />
            
            {selectedSessions.length === 0 && (
              <p className="text-sm text-yellow-500 flex items-center gap-1">
                <span>⚠️</span> This item is not linked to any sessions
              </p>
            )}
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
