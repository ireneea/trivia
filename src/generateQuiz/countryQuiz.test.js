import { getCountryQuizGame } from "./countryQuiz";
import "jest-extended";

expect.extend({
  toBeDistinct(received) {
    const pass = Array.isArray(received) && new Set(received).size === received.length;
    if (pass) {
      return {
        message: () => `expected [${received}] array is unique`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected [${received}] array is not to unique`,
        pass: false,
      };
    }
  },
});

const countries = genCharArray("a", "z").map((char) => createCountry({ name: char.toUpperCase(), capitalCity: char }));

function createCountry(country) {
  return {
    name: "AAAA",
    regions: [{ geoAreaCode: 100, geoAreaName: "100" }],
    capitalCity: "aaaa",
    population: 100000,
    surface: 652860,
    independent: true,
    hasFlagFile: true,
    ...country,
  };
}

function genCharArray(charA, charZ) {
  var a = [],
    i = charA.charCodeAt(0),
    j = charZ.charCodeAt(0);
  for (; i <= j; ++i) {
    a.push(String.fromCharCode(i));
  }
  return a;
}

describe("countryQuiz", () => {
  it("return valid game", () => {
    const game = getCountryQuizGame(countries);
    expectGameToBeValid(game);
    const hasCapitalInText = (question) => question.text.includes("is the capital of?");
    expect(game.questions).toSatisfyAll(hasCapitalInText);
  });
});

/**
 * A game is considered valid if it has 10 valid questions and there are no duplicated questions
 */
function expectGameToBeValid(game) {
  expect(game.questions).toBeArrayOfSize(10);
  game.questions.forEach((question) => expectQuestionToBeValid(question));
  expect(game.questions.map((q) => q.text)).toBeDistinct();
}

function expectQuestionToBeValid(question) {
  expect(question).toContainAllKeys(["text", "correctAnswer", "choices"]);
  expectStringToHaveContent(question.text);
  expectStringToHaveContent(question.correctAnswer);

  expect(question.choices).toBeArrayOfSize(4);
  question.choices.forEach((choice) => expectChoiceToBeValid(choice));

  expect(question.choices).toIncludeAnyMembers([{ answer: question.correctAnswer }]);
  expect(question.choices.map((c) => c.answer)).toBeDistinct();
}

function expectChoiceToBeValid(choice) {
  expect(choice).toContainAllKeys(["answer"]);
  expectStringToHaveContent(choice.answer);
}

function expectStringToHaveContent(string) {
  expect(string).toBeString();
  expect(string).not.toBeEmpty();
}
