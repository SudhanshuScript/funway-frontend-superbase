
import { DashboardData } from "./types";

// Apply location filter to dashboard data
export const applyLocationFilter = (
  data: DashboardData,
  location: string,
  country?: string,
  city?: string
): DashboardData => {
  let filteredData = { ...data };
  
  // Filter based on location type
  if (location === "country" && country) {
    // Filter data for specific country
    const countryInfo = filteredData.countryData?.find(c => c.code === country);
    if (countryInfo) {
      filteredData.summary.revenue.total = countryInfo.revenue;
      filteredData.summary.bookings.total = countryInfo.bookings;
      filteredData.summary.satisfaction.score = countryInfo.satisfaction;
    }
  } else if (location === "city" && country && city && filteredData.cityData) {
    // Filter data for specific city
    const cityList = filteredData.cityData[country];
    if (cityList) {
      const cityInfo = cityList.find(c => c.name === city);
      if (cityInfo) {
        filteredData.summary.revenue.total = cityInfo.revenue;
        filteredData.summary.bookings.total = cityInfo.bookings;
        filteredData.summary.satisfaction.score = cityInfo.satisfaction;
      }
    }
  }

  return filteredData;
};
