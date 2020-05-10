import { Machine, MachineConfig, assign } from "xstate";

export const events = {
  START: "START",
  ANSWER: "ANSWER",
  CORRECT_ANSWER: "CORRECT_ANSWER",
  INCORRECT_ANSWER: "INCORRECT_ANSWER",
  NO_ANSWER: "NO_ANSWER",
  NEXT_ROUND: "NEXT_ROUND",
  QUIT: "QUIT",
};

const config: MachineConfig<any, any, any> = {
  id: "game",
  initial: "idling",
  context: {
    rounds: 0,
    currentRound: 0,
    score: 0,
    results: {},
  },
  on: {
    [events.QUIT]: ".gameOver",
  },
  states: {
    idling: {
      on: {
        [events.START]: {
          target: "answering",
          cond: "isGameValid",
        },
      },
    },
    answering: {
      entry: "onQuestionStart",
      on: {
        [events.CORRECT_ANSWER]: "feedback.correct",
        [events.INCORRECT_ANSWER]: "feedback.incorrect",
        [events.NO_ANSWER]: "feedback.noAnswer",
      },
    },
    feedback: {
      on: {
        [events.NEXT_ROUND]: [
          {
            target: "answering",
            cond: "isNotLastRound",
          },
          {
            target: "gameOver",
            cond: "isLastRound",
          },
        ],
      },
      states: {
        correct: {
          entry: "onCorrectAnswer",
        },
        incorrect: {
          entry: "onIncorrectAnswer",
        },
        noAnswer: {
          entry: "onNoAnswer",
        },
      },
    },
    gameOver: {
      type: "final",
    },
  },
};

const guards = {
  isGameValid: (ctx) => {
    const isValid = !!ctx.rounds && ctx.rounds > 0;
    return isValid;
  },
  isNotLastRound: (ctx) => {
    const { currentRound, rounds } = ctx;
    return currentRound < rounds;
  },
  isLastRound: (ctx) => {
    const { currentRound, rounds } = ctx;
    return currentRound === rounds;
  },
};

const actions = {
  onQuestionStart: assign({
    currentRound: (ctx) => ctx.currentRound + 1,
  }),
  onCorrectAnswer: assign({
    score: (ctx, event) => {
      const points = event?.points || 0;
      return ctx.score + points;
    },
    results: (ctx, event) => {
      return {
        ...ctx.results,
        [ctx.currentRound]: "correct",
      };
    },
  }),
  onIncorrectAnswer: assign({
    results: (ctx, event) => {
      return {
        ...ctx.results,
        [ctx.currentRound]: "incorrect",
      };
    },
  }),
  onNoAnswer: assign({
    results: (ctx, event) => {
      return {
        ...ctx.results,
        [ctx.currentRound]: "noAnswer",
      };
    },
  }),
};

export default {
  events,
  config,
  options: {
    guards,
    actions,
  },
  machine: Machine(config, {
    guards,
    actions,
  }),
};
