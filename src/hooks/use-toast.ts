
import { toast as sonnerToast } from "sonner";
import * as React from "react";

export type ToastProps = {
  id?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive" | "success" | "warning";
  duration?: number;
};

// We need to define a type for our toast store
type Toast = ToastProps & {
  id: string;
  createdAt: Date;
};

type ToasterToast = Toast;

// Create a toast context with an empty array of toasts
const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 1000;

type ToasterState = {
  toasts: ToasterToast[];
};

// Initial state
const initialState: ToasterState = {
  toasts: [],
};

// Create a simulated store for toasts (compatible with both Toaster and Sonner)
let toasts: ToasterToast[] = [];

// This is a simplified implementation that ensures compatibility
const useToast = () => {
  // Provide a function to add toast that works with Sonner but returns data in our expected format
  const toast = ({
    title,
    description,
    action,
    variant = "default",
    duration = 5000,
  }: ToastProps) => {
    // Map variants to sonner toast types
    if (variant === "destructive") {
      return sonnerToast.error(title, {
        description,
        action,
        duration,
      });
    } else if (variant === "success") {
      return sonnerToast.success(title, {
        description,
        action,
        duration,
      });
    } else if (variant === "warning") {
      return sonnerToast.warning(title, {
        description,
        action,
        duration,
      });
    } else {
      return sonnerToast(title || "", {
        description,
        action,
        duration,
      });
    }
  };

  // Return the toast function and the list of toasts
  return { 
    toast,
    toasts // This is what the Toaster component is looking for
  };
};

// Direct toast access for simpler cases
const toast = {
  default: (title: string, options?: any) => sonnerToast(title, options),
  success: (title: string, options?: any) => sonnerToast.success(title, options),
  error: (title: string, options?: any) => sonnerToast.error(title, options),
  warning: (title: string, options?: any) => sonnerToast.warning(title, options),
  info: (title: string, options?: any) => sonnerToast.info(title, options),
  promise: sonnerToast.promise,
  dismiss: sonnerToast.dismiss,
  custom: sonnerToast.custom,
};

export { useToast, toast };
