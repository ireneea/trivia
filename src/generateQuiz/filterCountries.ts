import _isNumber from "lodash/isNumber";

import { Country, CountryFilters } from "../ts/appTypes";

export function filterCountries(countries: Country[], filters: CountryFilters = {}) {
  const {
    regions = [],
    withFlag = false,
    withPopulation = false,
    withSurface = false,
    withCapital = false,
    independent = false,
  } = filters;

  return countries.filter((country) => {
    let include =
      isValidCountry(country) &&
      matchIndependent(country, independent) &&
      matchRegions(country, regions) &&
      matchFlag(country, withFlag) &&
      matchPopulation(country, withPopulation) &&
      matchSurface(country, withSurface) &&
      matchCapital(country, withCapital);

    return include;
  });
}

function isValidCountry(country?: Country): boolean {
  return !!country && !!country.name;
}

function matchIndependent(country: Country, independent: boolean): boolean {
  return independent !== true || country.independent === true;
}

function matchRegions(country: Country, regions: number[]): boolean {
  let match = true;
  if (Array.isArray(regions) && regions.length > 0 && Array.isArray(country.regions)) {
    match = !!country.regions.find((r) => regions.includes(r.geoAreaCode));
  }
  return match;
}

function matchFlag(country: Country, withFlag: boolean): boolean {
  return withFlag !== true || country.hasFlagFile === true;
}
function matchPopulation(country: Country, withPopulation: boolean): boolean {
  return withPopulation !== true || isPositiveNumber(country.population);
}
function matchSurface(country: Country, withSurface: boolean): boolean {
  return withSurface !== true || isPositiveNumber(country.surface);
}
function matchCapital(country: Country, withCapital: boolean): boolean {
  return withCapital !== true || !!country.capitalCity;
}

function isPositiveNumber(number: any): boolean {
  return _isNumber(number) && number > 0;
}
