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
  initial: "answering",
  context: {
    rounds: 0,
    currentRound: 0,
    score: 0,
    results: {},
  },
  on: {
    [events.QUIT]: ".gameOver",
    [events.START]: {
      target: "answering",
      cond: "eventHasRounds",
      actions: "initialise",
    },
  },
  states: {
    answering: {
      entry: "incrementRoundNumber",
      on: {
        [events.CORRECT_ANSWER]: {
          target: "feedback.correct",
          cond: "ctxHasRounds",
        },
        [events.INCORRECT_ANSWER]: {
          target: "feedback.incorrect",
          cond: "ctxHasRounds",
        },
        [events.NO_ANSWER]: {
          target: "feedback.noAnswer",
          cond: "ctxHasRounds",
        },
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
          entry: ["addScore", "setCorrectRoundResult"],
        },
        incorrect: {
          entry: "setIncorrectRoundResult",
        },
        noAnswer: {
          entry: "setNoAnswerRoundResult",
        },
      },
    },
    gameOver: {},
  },
};

const guards = {
  eventHasRounds: (ctx, event) => {
    const isValid = !!event.rounds && event.rounds > 0;
    return isValid;
  },
  ctxHasRounds: (ctx) => {
    const isValid = ctx && ctx.rounds > 0;
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
  incrementRoundNumber: assign({
    currentRound: (ctx) => ctx.currentRound + 1,
  }),
  addScore: assign({
    score: (ctx, event) => {
      const points = event?.points || 0;
      return ctx.score + points;
    },
  }),
  setCorrectRoundResult: assign({
    results: (ctx) => setCurrentRoundResult(ctx, "correct"),
  }),
  setIncorrectRoundResult: assign({
    results: (ctx) => setCurrentRoundResult(ctx, "incorrect"),
  }),
  setNoAnswerRoundResult: assign({
    results: (ctx) => setCurrentRoundResult(ctx, "noAnswer"),
  }),
  initialise: assign({
    rounds: (ctx, event) => event.rounds,
    currentRound: (ctx, event) => 0,
    score: (ctx, event) => 0,
    results: (ctx, event) => ({}),
  }),
};

const setCurrentRoundResult = (ctx, result) => {
  return {
    ...ctx.results,
    [ctx.currentRound]: result,
  };
};

/**
 * @see https://xstate.js.org/viz/?gist=833a13822bc491cfce78c7da995a1798
 */
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
