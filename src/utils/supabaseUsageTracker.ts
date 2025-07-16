
import { supabase } from "@/integrations/supabase/client";

// Interface for usage statistics
interface UsageStats {
  auth: {
    logins: number;
    signups: number;
    passwordResets: number;
  };
  storage: {
    uploads: number;
    downloads: number;
    deletes: number;
  };
  realtime: {
    subscriptions: number;
    messages: number;
  };
  functions: {
    invocations: Record<string, number>;
  };
}

// Initialize the stats in localStorage if they don't exist
const initializeStats = (): UsageStats => {
  const defaultStats: UsageStats = {
    auth: { logins: 0, signups: 0, passwordResets: 0 },
    storage: { uploads: 0, downloads: 0, deletes: 0 },
    realtime: { subscriptions: 0, messages: 0 },
    functions: { invocations: {} }
  };
  
  if (!localStorage.getItem('supabaseUsage')) {
    localStorage.setItem('supabaseUsage', JSON.stringify(defaultStats));
  }
  
  return JSON.parse(localStorage.getItem('supabaseUsage') || JSON.stringify(defaultStats));
};

// Get current stats
const getStats = (): UsageStats => {
  return JSON.parse(localStorage.getItem('supabaseUsage') || '{}');
};

// Save updated stats
const saveStats = (stats: UsageStats) => {
  localStorage.setItem('supabaseUsage', JSON.stringify(stats));
};

// Track auth operations
export const trackAuth = (operation: 'login' | 'signup' | 'passwordReset') => {
  const stats = getStats();
  stats.auth[operation === 'login' ? 'logins' : operation === 'signup' ? 'signups' : 'passwordResets']++;
  saveStats(stats);
  console.log(`Auth operation tracked: ${operation}`);
};

// Track storage operations
export const trackStorage = (operation: 'upload' | 'download' | 'delete') => {
  const stats = getStats();
  stats.storage[operation === 'upload' ? 'uploads' : operation === 'download' ? 'downloads' : 'deletes']++;
  saveStats(stats);
  console.log(`Storage operation tracked: ${operation}`);
};

// Track realtime operations
export const trackRealtime = (operation: 'subscription' | 'message') => {
  const stats = getStats();
  stats.realtime[operation === 'subscription' ? 'subscriptions' : 'messages']++;
  saveStats(stats);
  console.log(`Realtime operation tracked: ${operation}`);
};

// Track edge function invocations
export const trackFunction = (functionName: string) => {
  const stats = getStats();
  if (!stats.functions.invocations[functionName]) {
    stats.functions.invocations[functionName] = 0;
  }
  stats.functions.invocations[functionName]++;
  saveStats(stats);
  console.log(`Function invocation tracked: ${functionName}`);
};

// Reset all stats
export const resetStats = () => {
  const defaultStats: UsageStats = {
    auth: { logins: 0, signups: 0, passwordResets: 0 },
    storage: { uploads: 0, downloads: 0, deletes: 0 },
    realtime: { subscriptions: 0, messages: 0 },
    functions: { invocations: {} }
  };
  saveStats(defaultStats);
};

// Initialize stats when the module is loaded
initializeStats();

// Export the current stats getter for components to use
export const getUsageStats = getStats;
