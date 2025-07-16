
import { saveAs } from 'file-saver';
import { generateCSVData } from "./mockDashboardData";

export const downloadCSVReport = () => {
  const csvContent = generateCSVData();
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  try {
    saveAs(blob, `flydining-dashboard-${new Date().toISOString().split('T')[0]}.csv`);
  } catch (error) {
    console.error('Error saving file:', error);
  }
};

export const previewEmailTemplate = (franchiseName: string) => {
  // In a real app, this would open a modal with the email preview
  // or integrate with an email preview service
  console.log(`Previewing email template for ${franchiseName}`);
  return true;
};

export const generateFranchiseReport = async (franchiseId: string) => {
  try {
    const data = await getFranchiseData(franchiseId);
    return downloadCSVReport();
  } catch (error) {
    console.error('Error generating report:', error);
    throw new Error('Failed to generate franchise report');
  }
};

const getFranchiseData = async (franchiseId: string) => {
  // Mock data fetch - in real app, this would call Supabase
  return {
    revenue: 12400,
    bookings: { online: 35, walkIn: 7 },
    occupancy: "84%"
  };
};
