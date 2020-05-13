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
