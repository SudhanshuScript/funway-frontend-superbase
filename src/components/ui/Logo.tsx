
import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const Logo: React.FC<LogoProps> = ({ className = "", size = "md" }) => {
  const sizeClasses = {
    sm: "h-6",
    md: "h-8",
    lg: "h-12"
  };

  return (
    <div className={`${className}`}>
      <img 
        src="/lovable-uploads/73817c0e-c796-4a3b-809c-e01471ab4cd0.png" 
        alt="FLY Dining Logo" 
        className={`${sizeClasses[size]}`} 
      />
    </div>
  );
};
