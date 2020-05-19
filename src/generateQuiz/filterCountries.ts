import _isNumber from "lodash/isNumber";

export function filterCountries(countries, filters = {}) {
  const {
    regions = undefined,
    withFlag = false,
    withPopulation = false,
    withSurface = false,
    withCapital = false,
    independent = false,
  } = filters;

  const matchIndependent = (country) => independent !== true || country.independent === true;
  const matchFlag = (country) => withFlag !== true || country.hasFlagFile === true;
  const matchPopulation = (country) => withPopulation !== true || isPositiveNumber(country.population);
  const matchSurface = (country) => withSurface !== true || isPositiveNumber(country.surface);
  const matchCapital = (country) => withCapital !== true || !!country.capitalCity;

  return countries.filter((country) => {
    let include =
      // !!country.name &&
      matchIndependent(country) &&
      countryMatchesRegion(country, regions) &&
      matchFlag(country) &&
      matchPopulation(country) &&
      matchSurface(country) &&
      matchCapital(country);

    return include;
  });
}

function countryMatchesRegion(country, regions) {
  let match = true;
  if (Array.isArray(regions) && regions.length > 0 && Array.isArray(country.regions)) {
    match = country.regions.find((r) => regions.includes(r.geoAreaCode));
  }
  return match;
}

function isPositiveNumber(number: any): boolean {
  return _isNumber(number) && number > 0;
}
