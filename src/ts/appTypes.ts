export type GameType = {
  questions: QuestionType[];
};

export type GameResults = Record<string, AnswerResult>;

export enum AnswerResult {
  CORRECT = "correct",
  INCORRECT = "incorrect",
  NO_ANSWER = "noAnswer",
}

export type QuestionType = {
  text: string;
  correctAnswer: string;
  choices: AnswerType[];
};

export type AnswerType = {
  answer: string;
};

export type RoutesStackParamList = {
  Start: undefined;
  // NOTES: might want to make the game parameter required
  Game: { game: GameType } | undefined;
  Score: { points: number; results: GameResults };
};

export type Region = {
  geoAreaCode: number;
  geoAreaName: string;
};

export type Country = {
  name: string;
  m49Code: string;
  iso2Code: string;
  iso3Code: string;
  regions: Region[];
  capitalCity: string;
  population: number;
  populationYear: string;
  surface: number;
  surfaceYear: string;
  independent: boolean;
  hasFlagFile: boolean;
};

export type CountryFilters = {
  regions?: number[];
  withFlag?: boolean;
  withPopulation?: boolean;
  withSurface?: boolean;
  withCapital?: boolean;
  independent?: boolean;
};
