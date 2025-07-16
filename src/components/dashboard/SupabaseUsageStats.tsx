
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { getUsageStats, resetStats } from "@/utils/supabaseUsageTracker";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RefreshCw } from "lucide-react";

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

const SupabaseUsageStats: React.FC = () => {
  const [stats, setStats] = useState<UsageStats | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const currentStats = getUsageStats();
    setStats(currentStats);
  };

  const handleResetStats = () => {
    resetStats();
    loadStats();
    toast({
      title: "Statistics reset",
      description: "All usage statistics have been reset to zero."
    });
  };

  if (!stats) {
    return <div>Loading statistics...</div>;
  }

  // Prepare data for charts
  const authData = [
    { name: 'Logins', value: stats.auth.logins },
    { name: 'Signups', value: stats.auth.signups },
    { name: 'Password Resets', value: stats.auth.passwordResets },
  ];

  const storageData = [
    { name: 'Uploads', value: stats.storage.uploads },
    { name: 'Downloads', value: stats.storage.downloads },
    { name: 'Deletes', value: stats.storage.deletes },
  ];

  const realtimeData = [
    { name: 'Subscriptions', value: stats.realtime.subscriptions },
    { name: 'Messages', value: stats.realtime.messages },
  ];

  const functionsData = Object.entries(stats.functions.invocations).map(([name, count]) => ({
    name,
    value: count
  }));

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Supabase Usage Statistics</CardTitle>
          <CardDescription>Track calls made to different Supabase services</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={loadStats}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="destructive" onClick={handleResetStats}>Reset Stats</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="auth" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="auth">Authentication</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
            <TabsTrigger value="realtime">Realtime</TabsTrigger>
            <TabsTrigger value="functions">Edge Functions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="auth">
            <h3 className="text-lg font-medium mb-4">Authentication Operations</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={authData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" name="Count" />
              </BarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-card border rounded p-4 text-center">
                <div className="text-3xl font-bold">{stats.auth.logins}</div>
                <div className="text-sm text-muted-foreground">Logins</div>
              </div>
              <div className="bg-card border rounded p-4 text-center">
                <div className="text-3xl font-bold">{stats.auth.signups}</div>
                <div className="text-sm text-muted-foreground">Signups</div>
              </div>
              <div className="bg-card border rounded p-4 text-center">
                <div className="text-3xl font-bold">{stats.auth.passwordResets}</div>
                <div className="text-sm text-muted-foreground">Password Resets</div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="storage">
            <h3 className="text-lg font-medium mb-4">Storage Operations</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={storageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#82ca9d" name="Count" />
              </BarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-card border rounded p-4 text-center">
                <div className="text-3xl font-bold">{stats.storage.uploads}</div>
                <div className="text-sm text-muted-foreground">Uploads</div>
              </div>
              <div className="bg-card border rounded p-4 text-center">
                <div className="text-3xl font-bold">{stats.storage.downloads}</div>
                <div className="text-sm text-muted-foreground">Downloads</div>
              </div>
              <div className="bg-card border rounded p-4 text-center">
                <div className="text-3xl font-bold">{stats.storage.deletes}</div>
                <div className="text-sm text-muted-foreground">Deletes</div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="realtime">
            <h3 className="text-lg font-medium mb-4">Realtime Operations</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={realtimeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#ffc658" name="Count" />
              </BarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-card border rounded p-4 text-center">
                <div className="text-3xl font-bold">{stats.realtime.subscriptions}</div>
                <div className="text-sm text-muted-foreground">Subscriptions</div>
              </div>
              <div className="bg-card border rounded p-4 text-center">
                <div className="text-3xl font-bold">{stats.realtime.messages}</div>
                <div className="text-sm text-muted-foreground">Messages</div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="functions">
            <h3 className="text-lg font-medium mb-4">Edge Function Invocations</h3>
            {functionsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={functionsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#ff7300" name="Invocations" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No edge function invocations tracked yet
              </div>
            )}
            <div className="mt-4">
              <h4 className="font-medium mb-2">Function Invocation Details:</h4>
              {Object.keys(stats.functions.invocations).length > 0 ? (
                <ul className="space-y-2">
                  {Object.entries(stats.functions.invocations).map(([name, count]) => (
                    <li key={name} className="flex justify-between p-2 bg-muted rounded">
                      <span>{name}</span>
                      <span className="font-medium">{count} calls</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No edge functions have been called yet</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SupabaseUsageStats;
