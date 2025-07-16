
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportType, ReportData } from "@/utils/reportUtils";
import ReportVisualization from "./ReportVisualization";
import ReportDataTable from "./ReportDataTable";

interface ReportContentTabsProps {
  reportType: ReportType;
  data: ReportData[];
}

const ReportContentTabs: React.FC<ReportContentTabsProps> = ({
  reportType,
  data,
}) => {
  const [activeTab, setActiveTab] = useState("visualization");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="visualization">Visualization</TabsTrigger>
        <TabsTrigger value="table">Table View</TabsTrigger>
      </TabsList>
      <TabsContent value="visualization" className="space-y-4">
        <ReportVisualization reportType={reportType} data={data} />
      </TabsContent>
      <TabsContent value="table" className="space-y-4">
        <ReportDataTable reportType={reportType} data={data} />
      </TabsContent>
    </Tabs>
  );
};

export default ReportContentTabs;
