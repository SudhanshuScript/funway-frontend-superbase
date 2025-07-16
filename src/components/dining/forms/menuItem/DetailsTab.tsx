
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Image, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MenuItemCategory } from "@/types/menuTypes";
import { useFranchiseSelector } from "@/hooks/useFranchiseSelector";

const MENU_CATEGORIES: MenuItemCategory[] = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Dessert',
  'Special'
];

interface DetailsTabProps {
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  price: string;
  setPrice: (price: string) => void;
  category: string;
  setCategory: (category: string) => void;
  popular: boolean;
  setPopular: (popular: boolean) => void;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  imagePreview: string;
  setImagePreview: (preview: string) => void;
  selectedFranchise: string;
  setSelectedFranchise: (franchise: string) => void;
  isSuperAdmin: boolean;
  menuItemId?: string;
}

export function DetailsTab({
  name,
  setName,
  description,
  setDescription,
  price,
  setPrice,
  category,
  setCategory,
  popular,
  setPopular,
  imageFile,
  setImageFile,
  imagePreview,
  setImagePreview,
  selectedFranchise,
  setSelectedFranchise,
  isSuperAdmin,
  menuItemId
}: DetailsTabProps) {
  const { franchises } = useFranchiseSelector();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

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
    </div>
  );
}
