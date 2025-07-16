
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Country, State } from '@/types/franchiseManagement';

// Sample location data (would typically come from an API or Supabase)
const countries: Country[] = [
  {
    name: "United States",
    code: "US",
    states: [
      {
        name: "California",
        code: "CA",
        cities: ["Los Angeles", "San Francisco", "San Diego", "San Jose"]
      },
      {
        name: "New York",
        code: "NY",
        cities: ["New York City", "Buffalo", "Rochester", "Albany"]
      },
      {
        name: "Texas",
        code: "TX",
        cities: ["Houston", "Austin", "Dallas", "San Antonio"]
      }
    ]
  },
  {
    name: "India",
    code: "IN",
    states: [
      {
        name: "Maharashtra",
        code: "MH",
        cities: ["Mumbai", "Pune", "Nagpur"]
      },
      {
        name: "Karnataka",
        code: "KA",
        cities: ["Bangalore", "Mysore", "Hubli"]
      },
      {
        name: "Delhi",
        code: "DL",
        cities: ["New Delhi", "Delhi"]
      }
    ]
  },
  {
    name: "United Kingdom",
    code: "UK",
    states: [
      {
        name: "England",
        code: "ENG",
        cities: ["London", "Manchester", "Birmingham"]
      },
      {
        name: "Scotland",
        code: "SCO",
        cities: ["Edinburgh", "Glasgow", "Aberdeen"]
      }
    ]
  }
];

interface LocationSelectorProps {
  countryValue: string;
  stateValue: string;
  cityValue: string;
  onCountryChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onCityChange: (value: string) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  countryValue,
  stateValue,
  cityValue,
  onCountryChange,
  onStateChange,
  onCityChange
}) => {
  const [availableStates, setAvailableStates] = useState<State[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  // Update available states when country changes
  useEffect(() => {
    if (countryValue) {
      const country = countries.find(c => c.name === countryValue);
      if (country) {
        setAvailableStates(country.states);
        
        // Reset state and city if country changed
        if (!country.states.some(s => s.name === stateValue)) {
          onStateChange("");
          onCityChange("");
        }
      } else {
        setAvailableStates([]);
        onStateChange("");
        onCityChange("");
      }
    } else {
      setAvailableStates([]);
      onStateChange("");
      onCityChange("");
    }
  }, [countryValue]);

  // Update available cities when state changes
  useEffect(() => {
    if (stateValue && countryValue) {
      const country = countries.find(c => c.name === countryValue);
      if (country) {
        const state = country.states.find(s => s.name === stateValue);
        if (state) {
          setAvailableCities(state.cities);
          
          // Reset city if state changed
          if (!state.cities.includes(cityValue)) {
            onCityChange("");
          }
        } else {
          setAvailableCities([]);
          onCityChange("");
        }
      }
    } else {
      setAvailableCities([]);
      onCityChange("");
    }
  }, [stateValue, countryValue]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="country">Country<span className="text-red-500">*</span></Label>
        <Select
          value={countryValue}
          onValueChange={onCountryChange}
        >
          <SelectTrigger id="country">
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Countries</SelectLabel>
              {countries.map(country => (
                <SelectItem key={country.code} value={country.name}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="state">State/Province<span className="text-red-500">*</span></Label>
        <Select
          value={stateValue}
          onValueChange={onStateChange}
          disabled={!countryValue || availableStates.length === 0}
        >
          <SelectTrigger id="state">
            <SelectValue placeholder="Select a state" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>States/Provinces</SelectLabel>
              {availableStates.map(state => (
                <SelectItem key={state.code} value={state.name}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="city">City<span className="text-red-500">*</span></Label>
        <Select
          value={cityValue}
          onValueChange={onCityChange}
          disabled={!stateValue || availableCities.length === 0}
        >
          <SelectTrigger id="city">
            <SelectValue placeholder="Select a city" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Cities</SelectLabel>
              {availableCities.map(city => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LocationSelector;
