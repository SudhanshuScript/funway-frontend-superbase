
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Award, Clock, Heart, Star, BarChart } from "lucide-react";
import { GuestStats } from "@/types/guestTypes";

interface GuestStatsCardsProps {
  stats: GuestStats;
}

const GuestStatsCards: React.FC<GuestStatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-primary" />
            <div className="text-2xl font-bold">{stats.totalGuests}</div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.newThisMonth} new this month
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">VIP Guests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Award className="h-5 w-5 mr-2 text-primary" />
            <div className="text-2xl font-bold">{stats.vipGuests}</div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.vipPercentage}% of total guests
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Average Visits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-primary" />
            <div className="text-2xl font-bold">{stats.averageVisits}</div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Per guest
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Guest Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Heart className="h-5 w-5 mr-2 text-primary" />
            <div className="text-2xl font-bold">{stats.recordedPreferences}</div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Recorded preferences
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Offer Engagement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Star className="h-5 w-5 mr-2 text-primary" />
            <div className="text-2xl font-bold">{stats.offerEngagement}%</div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Used at least one offer
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Popular Offer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <BarChart className="h-5 w-5 mr-2 text-primary" />
            <div className="text-lg font-bold truncate">{stats.mostPopularOffer}</div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Highest redemption rate
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuestStatsCards;
