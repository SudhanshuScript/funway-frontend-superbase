
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Session } from "@/types";

interface DeleteSessionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  session?: Session | null;
}

export function DeleteSessionDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  session 
}: DeleteSessionDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Session</AlertDialogTitle>
          <AlertDialogDescription>
            {session?.isSpecialDate ? (
              <p>
                This session is marked as a special date "{session?.specialDateName}".
                Deleting it will remove all special settings.
              </p>
            ) : (
              <p>Are you sure you want to delete this session?</p>
            )}
            <p className="mt-2">This action cannot be undone.</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
