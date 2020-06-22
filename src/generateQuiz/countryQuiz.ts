import _sampleSize from "lodash/sampleSize";
import _sample from "lodash/sample";
import _shuffle from "lodash/shuffle";

import { Country, GameType, QuestionType } from "../ts/appTypes";

// Games
//  - ✔ Country -> Capital
//  - ✔ Capital -> Country
//  - ✔ Surface -> Country
//  - ✔ Population -> Country
//  - ✔ Flag -> Country

export function getCountryQuizGame(countries: Country[]): GameType {
  const selectedCountries = _sampleSize(countries, 10);

  // By looping through 10 preselected country we insure that all the questions will be distinct
  const questions = selectedCountries.map((country) => {
    const questionFactories = [capitalCountryQuestion, countryCapitalQuestion];
    const questionFactory = _sample(questionFactories);
    return questionFactory(country, countries);
  });

  const game = { questions };
  return game;
}

const capitalCountryQuestion = (selectedCountry: Country, countries: Country[]) => {
  const question = {
    text: `${selectedCountry.capitalCity} is the capital of?`,
    correctAnswer: selectedCountry.name,
    choices: getShuffledCountriesToUse(selectedCountry, countries).map((c) => ({ answer: c.name })),
  };

  return question;
};

function countryCapitalQuestion(selectedCountry: Country, countries: Country[]): QuestionType {
  const question = {
    text: `What is the capital of ${selectedCountry.name}?`,
    correctAnswer: selectedCountry.capitalCity,
    choices: getShuffledCountriesToUse(selectedCountry, countries).map((c) => ({ answer: c.capitalCity })),
  };

  return question;
}

function getShuffledCountriesToUse(selectedCountry: Country, countries: Country[]): Country[] {
  const otherCountries = countries.filter((c) => c.name !== selectedCountry.name);

  // we pick three other countries than the selected one to build up 4 options
  const selectedCountries = [selectedCountry, ..._sampleSize(otherCountries, 3)];

  // the countries are shuffled before converting them into choices so that the correct answer doesn't always appear first
  const shuffledCountries = _shuffle(selectedCountries);

  return shuffledCountries;
}
