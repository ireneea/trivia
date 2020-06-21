import _sampleSize from "lodash/sampleSize";
import _shuffle from "lodash/shuffle";

import { Country, GameType } from "../ts/appTypes";

export function getCapitalCountryGame(countries: Country[]): GameType {
  const selectedCountries = _sampleSize(countries, 10);

  // By looping through 10 preselected country we insure that all the questions will be distinct
  const questions = selectedCountries.map((country) => generateQuestion(country, countries));

  const game = { questions };
  return game;
}

const generateQuestion = (selectedCountry: Country, countries: Country[]) => {
  const otherCountries = countries.filter((c) => c.name !== selectedCountry.name);

  // we pick three other countries than the selected one to build up 4 options
  const selectedCountries = [selectedCountry, ..._sampleSize(otherCountries, 3)];

  // the countries are shuffled before converting them into choices so that the correct answer doesn't always appear first
  const choices = _shuffle(selectedCountries).map((c) => ({ answer: c.name }));

  const questions = {
    text: `${selectedCountry.capitalCity} is the capital of?`,
    correctAnswer: selectedCountry.name,
    choices: choices,
  };

  return questions;
};
