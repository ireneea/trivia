import _sample from "lodash/sample";
import _last from "lodash/last";

import { filterCountries } from "./filterCountries";

const country100 = {
  name: "country100",
  m49Code: "1",
  iso2Code: "AA",
  iso3Code: "AAA",
  regions: [{ geoAreaCode: 100, geoAreaName: "100" }],
  capitalCity: "aaaa",
  population: 10000000,
  surface: 700000,
  independent: true,
  hasFlagFile: true,
};

const country300 = {
  name: "country300",
  m49Code: "5",
  iso2Code: "EE",
  iso3Code: "EEE",
  regions: [
    { geoAreaCode: 200, geoAreaName: "200" },
    { geoAreaCode: 300, geoAreaName: "300" },
  ],
  capitalCity: "eeee",
  population: 50000000,
  surface: 600000,
  independent: true,
  hasFlagFile: true,
};

const noFlagCountry = {
  name: "noFlag",
  m49Code: "5",
  iso2Code: "FF",
  iso3Code: "FFF",
  regions: [{ geoAreaCode: 200, geoAreaName: "200" }],
  capitalCity: "ffff",
  population: 50000000,
  surface: 600000,
  independent: true,
  hasFlagFile: false,
};

const undefinedPopulationCountry = {
  name: "undefinedPopulationCountry",
  m49Code: "6",
  iso2Code: "GG",
  iso3Code: "GGG",
  regions: [{ geoAreaCode: 400, geoAreaName: "400" }],
  capitalCity: "gggg",
  surface: 600000,
  independent: true,
  hasFlagFile: true,
};

const zeroPopulationCountry = {
  name: "zeroPopulationCountry",
  m49Code: "7",
  iso2Code: "HH",
  iso3Code: "HHH",
  regions: [{ geoAreaCode: 400, geoAreaName: "400" }],
  capitalCity: "hhhh",
  population: 0,
  surface: 600000,
  independent: true,
  hasFlagFile: true,
};

const undefinedSurfaceCountry = {
  name: "undefinedSurfaceCountry",
  m49Code: "8",
  iso2Code: "II",
  iso3Code: "III",
  regions: [{ geoAreaCode: 500, geoAreaName: "500" }],
  capitalCity: "iiii",
  population: 50000000,
  independent: true,
  hasFlagFile: true,
};

const zeroSurfaceCountry = {
  name: "zeroSurfaceCountry",
  m49Code: "9",
  iso2Code: "JJ",
  iso3Code: "JJJ",
  regions: [{ geoAreaCode: 500, geoAreaName: "500" }],
  capitalCity: "jjjj",
  population: 50000000,
  surface: 0,
  independent: true,
  hasFlagFile: true,
};

const emptyCapitalCountry = {
  name: "emptyCapitalCountry",
  m49Code: "10",
  iso2Code: "KK",
  iso3Code: "KKK",
  regions: [{ geoAreaCode: 600, geoAreaName: "600" }],
  capitalCity: "",
  population: 50000000,
  surface: 400000,
  independent: true,
  hasFlagFile: true,
};

const noCapitalCountry = {
  name: "noCapitalCountry",
  m49Code: "11",
  iso2Code: "LL",
  iso3Code: "LLL",
  regions: [{ geoAreaCode: 600, geoAreaName: "600" }],
  population: 50000000,
  surface: 400000,
  independent: true,
  hasFlagFile: true,
};

const undefinedIndependentCountry = {
  name: "undefinedIndependentCountry",
  m49Code: "12",
  iso2Code: "MM",
  iso3Code: "MMM",
  regions: [{ geoAreaCode: 700, geoAreaName: "700" }],
  capitalCity: "mmmm",
  population: 10000000,
  surface: 700000,
  hasFlagFile: true,
};

const notIndependentCountry = {
  name: "notIndependentCountry",
  m49Code: "13",
  iso2Code: "NN",
  iso3Code: "NNN",
  regions: [{ geoAreaCode: 700, geoAreaName: "700" }],
  capitalCity: "nnn",
  population: 10000000,
  surface: 700000,
  independent: false,
  hasFlagFile: true,
};

const countries = [
  country100,
  {
    name: "B",
    m49Code: "2",
    iso2Code: "BB",
    iso3Code: "BBB",
    regions: [{ geoAreaCode: 100, geoAreaName: "100" }],
    capitalCity: "bbbb",
    population: 50000000,
    surface: 600000,
    independent: true,
    hasFlagFile: true,
  },
  {
    name: "C",
    m49Code: "3",
    iso2Code: "CC",
    iso3Code: "CCC",
    regions: [
      { geoAreaCode: 100, geoAreaName: "100" },
      { geoAreaCode: 200, geoAreaName: "200" },
    ],
    capitalCity: "cccc",
    population: 50000000,
    surface: 600000,
    independent: true,
    hasFlagFile: true,
  },
  {
    name: "D",
    m49Code: "4",
    iso2Code: "DD",
    iso3Code: "DDD",
    regions: [{ geoAreaCode: 200, geoAreaName: "200" }],
    capitalCity: "dddd",
    population: 50000000,
    surface: 600000,
    independent: true,
    hasFlagFile: true,
  },
  country300,
  noFlagCountry,
  undefinedPopulationCountry,
  zeroPopulationCountry,
  undefinedSurfaceCountry,
  zeroSurfaceCountry,
  emptyCapitalCountry,
  noCapitalCountry,
  undefinedIndependentCountry,
  notIndependentCountry,
];

describe("filterCountries", () => {
  it("should return all countries no filters is set", () => {
    const filtered = filterCountries(countries);

    expect(filtered).toHaveLength(countries.length);
    expect(filtered).toContainEqual(_sample(countries));
  });

  it("should return all countries filters are empty", () => {
    const filtered = filterCountries(countries, {
      regions: [],
      withFlag: false,
      withPopulation: false,
      withSurface: false,
      withCapital: false,
      independent: false,
    });

    expect(filtered).toHaveLength(countries.length);
    expect(filtered).toContainEqual(_sample(countries));
  });

  it("should not include invalid countries", () => {
    const invalidCountry = {
      m49Code: "2",
      iso2Code: "BB",
      iso3Code: "BBB",
      regions: [{ geoAreaCode: 100, geoAreaName: "100" }],
      capitalCity: "bbbb",
      population: 50000000,
      surface: 600000,
      independent: true,
      hasFlagFile: true,
    };

    const filtered = filterCountries([...countries, invalidCountry]);

    expect(filtered).toHaveLength(countries.length);
    expect(filtered).not.toContainEqual(invalidCountry);
  });

  it("filter by one region", () => {
    const country = countries[0]; // we know that the first country has the region 100
    const filtered = filterCountries(countries, { regions: [100] });

    expect(filtered).toHaveLength(3);
    expect(filtered).toContainEqual(country);
  });

  it("filter by multiple regions", () => {
    const filtered = filterCountries(countries, { regions: [100, 300] });

    expect(filtered).toHaveLength(4);
    expect(filtered).toContainEqual(country100);
    expect(filtered).toContainEqual(country300);
  });

  it("ignore region filter if empty", () => {
    const filtered = filterCountries(countries, { regions: [] });

    expect(filtered).toHaveLength(countries.length);
    expect(filtered).toContainEqual(_sample(countries));
  });

  it("filter by flag", () => {
    const filtered = filterCountries(countries, { withFlag: true });

    expect(filtered).toHaveLength(countries.length - 1);
    expect(filtered).toContainEqual(country100);
    expect(filtered).toContainEqual(country300);
    expect(filtered).not.toContainEqual(noFlagCountry);
  });

  it("filter by population", () => {
    const filtered = filterCountries(countries, { withPopulation: true });

    expect(filtered).toHaveLength(countries.length - 2);
    expect(filtered).toContainEqual(country100);
    expect(filtered).toContainEqual(noFlagCountry);
    expect(filtered).toContainEqual(undefinedSurfaceCountry);
    expect(filtered).not.toContainEqual(undefinedPopulationCountry);
    expect(filtered).not.toContainEqual(zeroPopulationCountry);
  });

  it("filter by surface", () => {
    const filtered = filterCountries(countries, { withSurface: true });

    expect(filtered).toHaveLength(countries.length - 2);
    expect(filtered).toContainEqual(country100);
    expect(filtered).toContainEqual(noFlagCountry);
    expect(filtered).toContainEqual(undefinedPopulationCountry);
    expect(filtered).not.toContainEqual(undefinedSurfaceCountry);
    expect(filtered).not.toContainEqual(zeroSurfaceCountry);
  });

  it("filter by capital", () => {
    const filtered = filterCountries(countries, { withCapital: true });

    expect(filtered).toHaveLength(countries.length - 2);
    expect(filtered).toContainEqual(country100);
    expect(filtered).toContainEqual(noFlagCountry);
    expect(filtered).toContainEqual(undefinedPopulationCountry);
    expect(filtered).toContainEqual(undefinedSurfaceCountry);
    expect(filtered).not.toContainEqual(emptyCapitalCountry);
    expect(filtered).not.toContainEqual(noCapitalCountry);
  });

  it("filter by independent", () => {
    const filtered = filterCountries(countries, { independent: true });

    expect(filtered).toHaveLength(countries.length - 2);
    expect(filtered).toContainEqual(country100);
    expect(filtered).toContainEqual(noFlagCountry);
    expect(filtered).toContainEqual(undefinedPopulationCountry);
    expect(filtered).toContainEqual(undefinedSurfaceCountry);
    expect(filtered).toContainEqual(emptyCapitalCountry);
    expect(filtered).not.toContainEqual(undefinedIndependentCountry);
    expect(filtered).not.toContainEqual(notIndependentCountry);
  });
});
