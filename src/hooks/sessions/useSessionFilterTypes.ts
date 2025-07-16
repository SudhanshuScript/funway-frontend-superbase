
import { useState } from 'react';

// Define session filter types
export type SessionFilterType = "all" | "active" | "inactive" | "popular" | "underperforming" | "special";
export type SessionSortType = "date" | "name" | "capacity" | "bookings" | "duration";
export type SessionViewType = "list" | "calendar";

export function useSessionFilterTypes() {
  const [filterType, setFilterType] = useState<SessionFilterType>("all");
  const [sortBy, setSortBy] = useState<SessionSortType>("date");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewType, setViewType] = useState<SessionViewType>("list");
  
  return {
    filterType,
    setFilterType,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    viewType,
    setViewType
  };
}
