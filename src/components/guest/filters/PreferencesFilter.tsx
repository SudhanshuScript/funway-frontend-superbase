
import React from "react";
import { X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PreferencesFilterProps {
  preferences: string[];
  availablePreferences: string[];
  onTogglePreference: (preference: string) => void;
  onClearPreferences: () => void;
}

const PreferencesFilter: React.FC<PreferencesFilterProps> = ({
  preferences,
  availablePreferences,
  onTogglePreference,
  onClearPreferences,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <h4 className="font-medium flex items-center">
          <Heart className="h-4 w-4 mr-2" /> Preferences
        </h4>
        {preferences.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2"
            onClick={onClearPreferences}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {availablePreferences.map((pref) => (
          <Badge
            key={pref}
            variant={preferences.includes(pref) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onTogglePreference(pref)}
          >
            {pref}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default PreferencesFilter;
