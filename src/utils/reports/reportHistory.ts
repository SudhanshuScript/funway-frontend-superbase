
import { ReportHistoryItem } from './types';

// Local storage key for report history
const REPORT_HISTORY_KEY = 'flydining_report_history';

export const addToReportHistory = (report: ReportHistoryItem) => {
  const history = getReportHistory();
  history.unshift(report); // Add new report to the beginning
  
  // Limit history to 20 items
  const limitedHistory = history.slice(0, 20);
  
  localStorage.setItem(REPORT_HISTORY_KEY, JSON.stringify(limitedHistory));
};

export const getReportHistory = (): ReportHistoryItem[] => {
  const historyString = localStorage.getItem(REPORT_HISTORY_KEY);
  if (!historyString) return [];
  
  try {
    return JSON.parse(historyString);
  } catch (error) {
    console.error('Error parsing report history:', error);
    return [];
  }
};

export const clearReportHistory = () => {
  localStorage.removeItem(REPORT_HISTORY_KEY);
};
