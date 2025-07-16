
export interface CountryOption {
  value: string;
  label: string;
}

export interface StateOption {
  value: string;
  label: string;
  country: string;
}

export interface CityOption {
  value: string;
  label: string;
  state: string;
  country: string;
}

export interface CurrencyOption {
  value: string;
  label: string;
  symbol: string;
}

export interface TimezoneOption {
  value: string;
  offset: string;
  label: string;
}

export interface LanguageOption {
  value: string;
  label: string;
}
