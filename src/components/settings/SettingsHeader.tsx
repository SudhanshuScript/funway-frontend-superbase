
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, Settings as SettingsIcon } from "lucide-react";

interface SettingsHeaderProps {
  isAdmin: boolean;
  onGenerateReport: () => void;
}

const SettingsHeader: React.FC<SettingsHeaderProps> = ({ isAdmin, onGenerateReport }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <SettingsIcon className="h-6 w-6 mr-2" />
        <h2 className="text-2xl font-bold">Settings & Security</h2>
      </div>
      {isAdmin && (
        <Button onClick={onGenerateReport}>
          <FileText className="mr-2 h-4 w-4" /> Generate Security Report
        </Button>
      )}
    </div>
  );
};

export default SettingsHeader;
