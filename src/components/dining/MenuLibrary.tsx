import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MenuItem } from "@/types/menuTypes";
import { toast } from "sonner";
import { MenuSearchFilters } from "./library/MenuSearchFilters";
import { MenuItemsList } from "./library/MenuItemsList";
import { ViewModeToggle } from "./library/ViewModeToggle";
import { SessionsList } from "./library/SessionsList";
import { supabase } from "@/integrations/supabase/client";
import { useDiningSessionData } from "@/hooks/dining/useDiningSessionData";
import "../styles/dragdrop.css";

interface MenuLibraryProps {
  menuItems: MenuItem[];
  diningSchedule: any[];
  onSelectMenuItem: (item: MenuItem) => void;
  renderSessionBadges: (sessions?: string[]) => React.ReactNode;
  onAssignItemToSession: (itemId: string, sessionId: number) => void;
}

export function MenuLibrary({
  menuItems,
  diningSchedule,
  onSelectMenuItem,
  renderSessionBadges,
  onAssignItemToSession,
}: MenuLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [sessionAssignments, setSessionAssignments] = useState<Record<string, string[]>>({});

  // Use our Supabase integration hook
  const { 
    sessions, 
    sessionMenuItems, 
    handleAssignMenuItemToSession, 
    isUpdating 
  } = useDiningSessionData();
  
  // Filter menu items based on search and category
  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Get all unique categories
  const categories = Array.from(
    new Set(menuItems.map(item => item.category))
  ).sort();

  // Handle drag start for menu items
  const handleDragStart = (e: React.DragEvent, item: MenuItem) => {
    e.dataTransfer.setData("application/json", JSON.stringify({ 
      itemId: item.id,
      itemName: item.name 
    }));
    
    // Set the drag effect
    e.dataTransfer.effectAllowed = "copy";
    
    // Add dragging class for visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.add("opacity-50", "dragging");
    }
  };

  // Handle drag over for session cards
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
    e.stopPropagation();
    
    // Add visual feedback for valid drop target
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.add("drag-over");
    }
  };

  // Handle drop on session card
  const handleDrop = async (e: React.DragEvent, sessionId: string, sessionName: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isUpdating) {
      toast.info("Please wait, an update is already in progress...");
      return;
    }
    
    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      
      if (data && data.itemId) {
        const result = await handleAssignMenuItemToSession(
          data.itemId, 
          sessionId,
          data.itemName,
          sessionName
        );
        
        if (result) {
          // Update local state to reflect the assignment
          setSessionAssignments(prev => {
            const newAssignments = { ...prev };
            if (!newAssignments[data.itemId]) {
              newAssignments[data.itemId] = [];
            }
            if (!newAssignments[data.itemId].includes(sessionId)) {
              newAssignments[data.itemId] = [...newAssignments[data.itemId], sessionId];
            }
            return newAssignments;
          });
        }
      }
    } catch (error) {
      console.error("Error processing drop:", error);
      toast.error("Failed to assign item to session");
    }
  };

  // Load session assignments on mount
  useEffect(() => {
    const loadSessionAssignments = async () => {
      try {
        // This functionality is now handled by our useDiningSessionData hook
        // but we'll keep this structure for any additional initialization
      } catch (error) {
        console.error("Error loading session assignments:", error);
      }
    };

    loadSessionAssignments();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Menu Items Library - Left side */}
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Menu Library</CardTitle>
              <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
            </div>
          </CardHeader>
          <CardContent>
            <MenuSearchFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              categories={categories}
            />

            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">
                Drag menu items onto session cards to assign them
              </p>
              
              <MenuItemsList
                filteredMenuItems={filteredMenuItems}
                viewMode={viewMode}
                renderSessionBadges={renderSessionBadges}
                handleDragStart={handleDragStart}
                onSelectMenuItem={onSelectMenuItem}
                setSearchQuery={setSearchQuery}
                setCategoryFilter={setCategoryFilter}
                sessionAssignments={sessionAssignments}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Session Cards - Right side */}
      <div className="md:col-span-1">
        <SessionsList
          diningSchedule={sessions.length > 0 ? sessions : diningSchedule}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
        />
      </div>
    </div>
  );
}
