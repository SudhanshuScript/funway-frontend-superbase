
import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { MenuItem } from "@/types/menuTypes";
import { SteppedMenuItemForm } from "./forms/menuItem/SteppedMenuItemForm";
import { toast } from "sonner";

interface MenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItem?: MenuItem;
  onSave: (menuItem: MenuItem) => void;
  onDelete?: (menuItemId: string) => void;
  selectedSessions: string[];
  setSelectedSessions: (sessions: string[]) => void;
  availableSessions: any[];
  preselectedSession?: string;
}

export function MenuItemModal({
  isOpen,
  onClose,
  menuItem,
  onSave,
  onDelete,
  selectedSessions,
  setSelectedSessions,
  availableSessions,
  preselectedSession,
}: MenuItemModalProps) {
  // Reset sessions when opening a new menu item or apply preselected session
  useEffect(() => {
    if (!isOpen) return;
    
    if (menuItem?.id && menuItem.sessions && menuItem.sessions.length > 0) {
      // Map session names to session IDs for existing menu items
      const sessionIds = menuItem.sessions.map(sessionName => {
        const session = availableSessions.find(s => s.name === sessionName);
        return session ? session.id : null;
      }).filter(Boolean) as string[];
      
      setSelectedSessions(sessionIds);
    } else if (preselectedSession) {
      // If there's a preselected session (when adding from Dining Sessions tab)
      setSelectedSessions([preselectedSession]);
    } else {
      // Reset sessions when opening a new menu item form
      setSelectedSessions([]);
    }
  }, [menuItem, availableSessions, setSelectedSessions, isOpen, preselectedSession]);

  const handleSave = (menuItem: MenuItem) => {
    // Validate sessions
    if (selectedSessions.length === 0) {
      toast.error("Please assign the menu item to at least one session");
      return;
    }
    
    // Convert session IDs back to session names for storage
    const sessionNames = selectedSessions.map(sessionId => {
      const session = availableSessions.find(s => s.id === sessionId);
      return session ? session.name : null;
    }).filter(Boolean) as string[];
    
    // Update the menu item with the session names
    const updatedMenuItem = {
      ...menuItem,
      sessions: sessionNames
    };
    
    onSave(updatedMenuItem);
    onClose();
  };

  const handleDelete = (menuItemId: string) => {
    if (onDelete) {
      onDelete(menuItemId);
      onClose();
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className="max-w-[640px] max-h-[90vh] overflow-y-auto rounded-xl p-6 bg-background">
        <SteppedMenuItemForm
          menuItem={menuItem}
          onSave={handleSave}
          onCancel={onClose}
          onDelete={onDelete ? handleDelete : undefined}
          selectedSessions={selectedSessions}
          setSelectedSessions={setSelectedSessions}
          availableSessions={availableSessions}
        />
      </DialogContent>
    </Dialog>
  );
}
