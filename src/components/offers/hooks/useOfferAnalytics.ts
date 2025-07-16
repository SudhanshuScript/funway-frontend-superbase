
import { useState, useEffect } from 'react';
import { OfferAnalyticsData } from '@/types/offerTypes';
import { supabase } from '@/integrations/supabase/client';
import { mockAnalytics } from './mockOfferData';

export const useOfferAnalytics = (offerIds: string[]) => {
  const [analytics, setAnalytics] = useState<OfferAnalyticsData>(mockAnalytics);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchOfferAnalytics = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, this would be a Supabase call
        // For now, we're using mock data
        const { data } = await supabase.functions.invoke('offer-analytics', {
          body: { offerIds }
        });
        
        // For now, just use our mock data
        // In a real app, we'd update with the data from the function
        setAnalytics(mockAnalytics);
      } catch (error) {
        console.error('Error fetching offer analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (offerIds.length > 0) {
      fetchOfferAnalytics();
    }
  }, [offerIds]);

  return {
    analytics,
    isLoading
  };
};
