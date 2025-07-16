
import React from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import SupabaseUsageStats from "@/components/dashboard/SupabaseUsageStats";
import FileStorage from "@/components/storage/FileStorage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, ServerCog, HardDrive, Radio } from "lucide-react";

const SupabaseStats: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-6">
        <h1 className="text-3xl font-bold">Supabase Integration Hub</h1>
        <p className="text-muted-foreground">
          Monitor and manage your Supabase integrations for authentication, storage, edge functions, and realtime features.
        </p>
        
        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4 w-full md:w-[600px]">
            <TabsTrigger value="stats">
              <Database className="h-4 w-4 mr-2" />
              <span>Usage Stats</span>
            </TabsTrigger>
            <TabsTrigger value="storage">
              <HardDrive className="h-4 w-4 mr-2" />
              <span>Storage</span>
            </TabsTrigger>
            <TabsTrigger value="functions">
              <ServerCog className="h-4 w-4 mr-2" />
              <span>Functions</span>
            </TabsTrigger>
            <TabsTrigger value="realtime">
              <Radio className="h-4 w-4 mr-2" />
              <span>Realtime</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="stats">
            <div className="grid gap-6">
              <SupabaseUsageStats />
            </div>
          </TabsContent>
          
          <TabsContent value="storage">
            <div className="grid gap-6">
              <FileStorage />
            </div>
          </TabsContent>
          
          <TabsContent value="functions">
            <div className="bg-card border rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Edge Functions</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">Session Management</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    This edge function provides CRUD operations for session management with security and validation.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Function Name: <code>sessions</code></span>
                    <button 
                      className="text-sm text-blue-500 hover:underline"
                      onClick={() => window.open('https://vjwxmgaoqsfdyynqwynz.functions.supabase.co/functions/v1/sessions', '_blank')}
                    >
                      Test Function
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="realtime">
            <div className="bg-card border rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Realtime Channels</h2>
              <p className="mb-6">
                Realtime functionality is integrated with several parts of the application to provide live updates.
              </p>
              
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">Session Changes Channel</h3>
                  <p className="text-sm text-muted-foreground">
                    This channel tracks all changes to the sessions table and updates the UI accordingly.
                  </p>
                  <code className="text-xs block mt-2 bg-background p-2 rounded">
                    Channel name: 'session-changes'<br />
                    Events: INSERT, UPDATE, DELETE<br />
                    Table: public.sessions
                  </code>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SupabaseStats;
