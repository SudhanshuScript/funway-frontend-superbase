import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  FileSpreadsheet, Download, DollarSign, Users, Ticket, 
  MessageSquare, TrendingUp, BarChart3, Info,
  ChevronRight, LineChart, Filter, ArrowUpRight, PieChart, ArrowDownRight
} from "lucide-react";
import { CalendarIcon } from "lucide-react";
import RevenueChart from "./charts/RevenueChart";
import SessionsBarChart from "./charts/SessionsBarChart";
import RevenueBreakdownChart from "./charts/RevenueBreakdownChart";
import PieChartCard from "./charts/PieChartCard";
import RepeatGuestRateCard from "./charts/RepeatGuestRateCard";
import GuestLoyaltySection from "./sections/GuestLoyaltySection";
import OfferConversionRates from "./charts/OfferConversionRates";
import OfferRedemptionsTable from "./sections/OfferRedemptionsTable";
import FeedbackSection from "./sections/FeedbackSection";
import AnalyticsSummaryCards from "./sections/AnalyticsSummaryCards";
import InsightCard from "./components/InsightCard";
import ComparisonMetricCard from "./components/ComparisonMetricCard";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import SessionPerformanceTable from "./components/SessionPerformanceTable";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

// Mock data for analytics
const revenueData = [
  { name: "Jan", value: 4000 },
  { name: "Feb", value: 3000 },
  { name: "Mar", value: 2000 },
  { name: "Apr", value: 2780 },
  { name: "May", value: 1890 },
  { name: "Jun", value: 2390 },
  { name: "Jul", value: 3490 },
  { name: "Aug", value: 2950 },
  { name: "Sep", value: 3800 },
  { name: "Oct", value: 4200 },
  { name: "Nov", value: 4100 },
  { name: "Dec", value: 4800 },
];

const sessionData = [
  { name: "Breakfast", value: 1200 },
  { name: "Lunch", value: 2200 },
  { name: "Dinner", value: 3500 },
  { name: "Special", value: 1800 },
];

const revenueBreakdownTable = [
  { category: "Breakfast Sessions", revenue: "$12,546", growth: "+12%", growthIsPositive: true },
  { category: "Lunch Sessions", revenue: "$24,890", growth: "+8%", growthIsPositive: true },
  { category: "Dinner Sessions", revenue: "$36,250", growth: "+15%", growthIsPositive: true },
  { category: "Special Events", revenue: "$18,750", growth: "-3%", growthIsPositive: false },
];

const demographicData = [
  { name: "18-24", value: 15 },
  { name: "25-34", value: 35 },
  { name: "35-44", value: 25 },
  { name: "45-54", value: 15 },
  { name: "55+", value: 10 },
];

const offerData = [
  { name: "Summer Special", value: 45 },
  { name: "Weekend Pass", value: 65 },
  { name: "Family Offer", value: 35 },
  { name: "First-Time", value: 85 },
];

const offerConversionData = [
  { name: "Summer Special", rate: 45, count: 45, total: 100 },
  { name: "Weekend Pass", rate: 65, count: 65, total: 100 },
  { name: "Family Offer", rate: 35, count: 35, total: 100 },
  { name: "First-Time", rate: 85, count: 85, total: 100 },
];

const offerRedemptionsData = [
  {
    name: "Weekend Pass",
    date: "May 15, 2023",
    guest: "John Smith",
    discount: "$25.00",
    amount: "$75.00",
  },
  {
    name: "First-Time Discount",
    date: "May 14, 2023",
    guest: "Sarah Johnson",
    discount: "$30.00",
    amount: "$70.00",
  },
  {
    name: "Family Bundle",
    date: "May 12, 2023",
    guest: "Robert Williams",
    discount: "$50.00",
    amount: "$150.00",
  },
];

const feedbackData = [
  { name: "Food", value: 4.7 },
  { name: "Service", value: 4.5 },
  { name: "Ambiance", value: 4.9 },
  { name: "Value", value: 4.3 },
  { name: "Overall", value: 4.6 },
];

const feedbackEntries = [
  {
    name: "John Smith",
    rating: 5,
    comment: "The dining experience was incredible. The service was excellent and the view was breathtaking. Will definitely come back again!",
    date: "May 15, 2023",
    session: "Dinner Session",
  },
  {
    name: "Sarah Johnson",
    rating: 4,
    comment: "Great food and service, but the wait time was a bit longer than expected. The views made up for it though.",
    date: "May 12, 2023",
    session: "Lunch Session",
  },
];

const AnalyticsSection: React.FC = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2023, 0, 1),
    to: new Date(2023, 11, 31),
  });
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  
  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Date Range Filter & Actions */}
        <div className="flex flex-wrap justify-between gap-4 mb-2">
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <CalendarIcon className="h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Select date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={(newDate) => setDate(newDate)}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Filter analytics by various parameters</p>
              </TooltipContent>
            </Tooltip>
          </div>
          
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Excel
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export data to Excel spreadsheet</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download as PDF report</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline">
                  <LineChart className="h-4 w-4 mr-1" />
                  {viewMode === 'chart' ? 'Switch to Table' : 'Switch to Charts'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle between chart and table views</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        
        {/* Summary Metrics */}
        <AnalyticsSummaryCards />
        
        {/* Insights Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InsightCard 
            title="Revenue Growth"
            value="+12.5%"
            icon={<TrendingUp className="h-5 w-5" />}
            description="Revenue has grown 12.5% since last quarter"
            trend="up"
            color="green"
          />
          <InsightCard 
            title="Guest Retention"
            value="65.3%"
            icon={<Users className="h-5 w-5" />}
            description="65.3% of guests return within 30 days"
            trend="up"
            color="blue"
          />
          <InsightCard 
            title="Offer Conversion"
            value="48.2%"
            icon={<Ticket className="h-5 w-5" />}
            description="48.2% of offers are being redeemed"
            trend="down"
            color="amber"
          />
        </div>
        
        <Tabs defaultValue="revenue">
          <TabsList className="mb-4">
            <TabsTrigger value="revenue">
              <DollarSign className="h-4 w-4 mr-2" />
              Revenue
            </TabsTrigger>
            <TabsTrigger value="guests">
              <Users className="h-4 w-4 mr-2" />
              Guest Analytics
            </TabsTrigger>
            <TabsTrigger value="offers">
              <Ticket className="h-4 w-4 mr-2" />
              Offer Analytics
            </TabsTrigger>
            <TabsTrigger value="feedback">
              <MessageSquare className="h-4 w-4 mr-2" />
              Feedback
            </TabsTrigger>
            <TabsTrigger value="sessions">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Sessions
            </TabsTrigger>
          </TabsList>
          
          {/* Revenue Analytics */}
          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <ComparisonMetricCard
                title="Monthly Revenue"
                currentValue="$92,436"
                previousValue="$84,238"
                percentageChange={9.7}
                isPositive={true}
                icon={<DollarSign className="h-5 w-5" />}
              />
              <ComparisonMetricCard
                title="Average Order Value"
                currentValue="$84.52"
                previousValue="$78.25"
                percentageChange={8.0}
                isPositive={true}
                icon={<BarChart3 className="h-5 w-5" />}
              />
              <ComparisonMetricCard
                title="Revenue Per Guest"
                currentValue="$142.18"
                previousValue="$135.60"
                percentageChange={4.9}
                isPositive={true}
                icon={<PieChart className="h-5 w-5" />}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <RevenueChart data={revenueData} />
                <div className="absolute top-4 right-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Info className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Monthly revenue trends over the current year</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              
              <div className="relative">
                <SessionsBarChart data={sessionData} title="Top Performing Sessions" />
                <div className="absolute top-4 right-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Info className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Revenue breakdown by session type</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <RevenueBreakdownChart data={sessionData} tableData={revenueBreakdownTable} />
              <div className="absolute top-4 right-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Detailed breakdown of revenue by category with growth</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="absolute top-4 right-16">
                <Button size="sm" variant="ghost" className="h-8">
                  {viewMode === 'chart' ? 'View as Table' : 'View as Chart'}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </TabsContent>
          
          {/* Guest Analytics */}
          <TabsContent value="guests" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <ComparisonMetricCard
                title="Total Guests"
                currentValue="2,846"
                previousValue="2,532"
                percentageChange={12.4}
                isPositive={true}
                icon={<Users className="h-5 w-5" />}
              />
              <ComparisonMetricCard
                title="New Guests"
                currentValue="842"
                previousValue="738"
                percentageChange={14.1}
                isPositive={true}
                icon={<ArrowUpRight className="h-5 w-5" />}
              />
              <ComparisonMetricCard
                title="Guest Churn"
                currentValue="3.2%"
                previousValue="4.5%"
                percentageChange={28.8}
                isPositive={true}
                icon={<ArrowDownRight className="h-5 w-5" />}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <PieChartCard data={demographicData} title="Guest Demographics" />
                <div className="absolute top-4 right-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Info className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Age distribution of guests</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <div className="relative">
                <RepeatGuestRateCard />
                <div className="absolute top-4 right-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Info className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Percentage of repeat vs first-time guests</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="absolute top-4 right-16">
                  <Button size="sm" variant="ghost" className="h-8">
                    View Details
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
            
            <GuestLoyaltySection />
          </TabsContent>
          
          {/* Offer Analytics */}
          <TabsContent value="offers" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <ComparisonMetricCard
                title="Active Offers"
                currentValue="12"
                previousValue="8"
                percentageChange={50}
                isPositive={true}
                icon={<Ticket className="h-5 w-5" />}
              />
              <ComparisonMetricCard
                title="Redemption Rate"
                currentValue="48.2%"
                previousValue="42.5%"
                percentageChange={13.4}
                isPositive={true}
                icon={<BarChart3 className="h-5 w-5" />}
              />
              <ComparisonMetricCard
                title="Avg. Discount"
                currentValue="$28.45"
                previousValue="$31.20"
                percentageChange={8.8}
                isPositive={true}
                icon={<DollarSign className="h-5 w-5" />}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <SessionsBarChart data={offerData} title="Coupon Usage" />
                <div className="absolute top-4 right-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Info className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Offer usage statistics by type</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <div className="relative">
                <OfferConversionRates offersData={offerConversionData} />
                <div className="absolute top-4 right-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Info className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Conversion rates for each offer type</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
            
            <OfferRedemptionsTable redemptions={offerRedemptionsData} />
          </TabsContent>
          
          {/* Feedback Analytics */}
          <TabsContent value="feedback" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <ComparisonMetricCard
                title="Overall Rating"
                currentValue="4.6"
                previousValue="4.4"
                percentageChange={4.5}
                isPositive={true}
                icon={<MessageSquare className="h-5 w-5" />}
              />
              <ComparisonMetricCard
                title="Total Reviews"
                currentValue="842"
                previousValue="756"
                percentageChange={11.4}
                isPositive={true}
                icon={<BarChart3 className="h-5 w-5" />}
              />
              <ComparisonMetricCard
                title="Positive Sentiment"
                currentValue="86.3%"
                previousValue="82.1%"
                percentageChange={5.1}
                isPositive={true}
                icon={<TrendingUp className="h-5 w-5" />}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <SessionsBarChart
                  data={feedbackData.map(item => ({ name: item.name, value: item.value }))}
                  title="Guest Feedback Ratings"
                />
                <div className="absolute top-4 right-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Info className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Average ratings across different categories</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <div className="relative">
                <PieChartCard
                  data={[
                    { name: "Service", value: 35 },
                    { name: "Food", value: 25 },
                    { name: "Ambiance", value: 20 },
                    { name: "Value", value: 15 },
                    { name: "Cleanliness", value: 5 },
                  ]}
                  title="Feedback Themes"
                />
                <div className="absolute top-4 right-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Info className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Distribution of feedback by theme</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
            
            <FeedbackSection feedback={feedbackEntries} />
          </TabsContent>
          
          {/* Sessions Analytics */}
          <TabsContent value="sessions" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <ComparisonMetricCard
                title="Total Sessions"
                currentValue="184"
                previousValue="162"
                percentageChange={13.6}
                isPositive={true}
                icon={<Calendar className="h-5 w-5" />}
              />
              <ComparisonMetricCard
                title="Avg. Occupancy"
                currentValue="78.4%"
                previousValue="72.1%"
                percentageChange={8.7}
                isPositive={true}
                icon={<Users className="h-5 w-5" />}
              />
              <ComparisonMetricCard
                title="Revenue/Session"
                currentValue="$1,842"
                previousValue="$1,721"
                percentageChange={7.0}
                isPositive={true}
                icon={<DollarSign className="h-5 w-5" />}
              />
            </div>
            
            <div className="relative">
              <SessionPerformanceTable />
              <div className="absolute top-4 right-4">
                <Button size="sm" variant="outline">
                  View All Sessions
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
};

export default AnalyticsSection;
