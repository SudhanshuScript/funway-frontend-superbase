
import React from "react";

interface SectionHeaderProps {
  title: string;
  collapsed: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, collapsed }) => {
  if (collapsed) return null;
  
  return (
    <div className="px-3 mb-2 text-xs uppercase font-semibold text-muted-foreground">
      {title}
    </div>
  );
};
