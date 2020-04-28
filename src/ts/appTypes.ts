export type GameType = {
  questions: QuestionType[];
};

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
  Score: undefined;
};
