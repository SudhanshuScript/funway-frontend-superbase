
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle, ChevronDown, ChevronUp, Lightbulb, TrendingUp, HelpCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface AnalyticsErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export const AnalyticsErrorFallback: React.FC<AnalyticsErrorFallbackProps> = ({
  error,
  resetErrorBoundary
}) => {
  const [showTips, setShowTips] = useState(false);
  const [showInsight, setShowInsight] = useState(false);

  // Motivational tips for session management
  const sessionTips = [
    "Try adding 'Early Bird' discounts to boost morning sessions",
    "Consider renaming underperforming sessions for better appeal",
    "Add themed sessions on weekends to attract more guests",
    "Analyze your busiest hours and duplicate those session times",
    "Adjust capacity limits for better session management"
  ];

  // Quick insights that might be helpful
  const quickInsights = [
    "Weekend sessions typically have 30% higher occupancy",
    "Themed sessions see 25% better retention rates",
    "Sessions in the 6-8 PM range are most popular across franchises",
    "Morning sessions paired with breakfast offers see 40% better bookings"
  ];

  // Get a random tip and insight
  const randomTip = sessionTips[Math.floor(Math.random() * sessionTips.length)];
  const randomInsight = quickInsights[Math.floor(Math.random() * quickInsights.length)];
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <Alert variant="default" className="bg-amber-50 border border-amber-200">
        <div className="flex flex-col space-y-4 w-full">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-amber-800 mr-2" />
              <AlertTitle className="text-lg font-medium text-amber-800">Analytics Temporarily Unavailable</AlertTitle>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={resetErrorBoundary}
                    className="bg-white hover:bg-amber-100 border-amber-300"
                    size="sm"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reload Analytics
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Try reloading the analytics data</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <AlertDescription className="text-amber-700">
            <p className="mb-3">We couldn't fetch session analytics right now. Don't worry — your sessions are still running smoothly!</p>
            
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-2 p-2 bg-amber-100 rounded text-sm overflow-auto max-h-24 mb-3">
                <code>{error.message}</code>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <Collapsible open={showTips} onOpenChange={setShowTips} className="w-full">
                <Card className="border border-amber-200 bg-amber-50/50">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full flex items-center justify-between p-3 hover:bg-amber-100/50">
                      <div className="flex items-center">
                        <Lightbulb className="h-4 w-4 mr-2 text-amber-600" />
                        <span className="font-medium text-amber-800">Session Management Tip</span>
                      </div>
                      {showTips ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-2 pb-3 px-4">
                      <p className="text-sm text-amber-700 italic">"{randomTip}"</p>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              <Collapsible open={showInsight} onOpenChange={setShowInsight} className="w-full">
                <Card className="border border-amber-200 bg-amber-50/50">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full flex items-center justify-between p-3 hover:bg-amber-100/50">
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-amber-600" />
                        <span className="font-medium text-amber-800">Data Insight</span>
                      </div>
                      {showInsight ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-2 pb-3 px-4">
                      <p className="text-sm text-amber-700 italic">"{randomInsight}"</p>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            </div>

            <div className="flex items-center justify-end mt-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="link" size="sm" className="text-amber-700">
                      <HelpCircle className="h-3 w-3 mr-1" />
                      <span className="text-xs">Why can't I see my analytics?</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-[250px] text-xs">Analytics might be temporarily unavailable due to data processing, high traffic, or server maintenance. We're working to resolve this as quickly as possible.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </AlertDescription>
        </div>
      </Alert>
    </motion.div>
  );
};

export default AnalyticsErrorFallback;
