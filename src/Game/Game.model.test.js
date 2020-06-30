import React from "react";

import { Machine } from "xstate";
import { createModel } from "@xstate/test";
import { render, fireEvent, act } from "@testing-library/react-native";
import _set from "lodash/set";

import { mockNavigationProps, mockRouteParamsProps } from "../../utils";

import Game from "./Game";
import { READ_ANSWER_TIME, ANSWER_TIME } from "./GameParameters";
import { correctAnswerContainer, incorrectAnswerContainer } from "./Answer";
import gameMachine from "./gameMachine";

jest.useFakeTimers();

const fakeGame = {
  questions: [
    {
      text: "Question 1?",
      correctAnswer: "correct",
      choices: [{ answer: "fake1" }, { answer: "incorrect" }, { answer: "correct" }, { answer: "fake2" }],
    },
    {
      text: "Question 2?",
      correctAnswer: "correct",
      choices: [{ answer: "incorrect" }, { answer: "fake3" }, { answer: "fake4" }, { answer: "correct" }],
    },
  ],
};

const gameModel = createModel(generateTestMachine()).withEvents({
  [gameMachine.events.QUIT]: {
    exec: () => {},
  },
  [gameMachine.events.START]: {
    exec: () => {},
  },
  [gameMachine.events.CORRECT_ANSWER]: {
    exec: ({ component }) => {
      fireEvent.press(component.getByLabelText("correct"));
    },
  },
  [gameMachine.events.INCORRECT_ANSWER]: {
    exec: ({ component }) => {
      fireEvent.press(component.getByLabelText("incorrect"));
    },
  },
  [gameMachine.events.NO_ANSWER]: {
    exec: () => {
      act(() => jest.advanceTimersByTime(ANSWER_TIME));
    },
  },
  [gameMachine.events.NEXT_ROUND]: {
    exec: () => {
      act(() => jest.advanceTimersByTime(READ_ANSWER_TIME));
    },
  },
});

function generateTestMachine() {
  const config = { ...gameMachine.config };

  const isOther = (a) => !isCorrect(a) && !isIncorrect(a);
  const isCorrect = ({ answer }) => answer === "correct";
  const isIncorrect = ({ answer }) => answer === "incorrect";

  addTestToSateNode(config, "idling", () => {});

  addTestToSateNode(config, "answering", async (testContext, state) => {
    const { currentRound } = state.context;
    const { expectAnswer } = testContext;
    const answers = fakeGame.questions[currentRound - 1].choices;
    expectAnswer.toBeNeutral(answers.find(isCorrect));
    expectAnswer.toBeNeutral(answers.find(isIncorrect));
    answers.filter(isOther).forEach((answer) => {
      testContext.expectAnswer.toBeNeutral(answer);
    });
  });

  addTestToSateNode(config, "feedback", () => {});

  addTestToSateNode(config, "feedback.correct", (testContext, state) => {
    const { currentRound } = state.context;
    const { expectAnswer } = testContext;
    const answers = fakeGame.questions[currentRound - 1].choices;
    expectAnswer.toBeCorrect(answers.find(isCorrect));
    expectAnswer.toBeNeutral(answers.find(isIncorrect));
    answers.filter(isOther).forEach((answer) => {
      testContext.expectAnswer.toBeNeutral(answer);
    });
  });

  addTestToSateNode(config, "feedback.incorrect", (testContext, state) => {
    const { currentRound } = state.context;
    const { expectAnswer } = testContext;
    const answers = fakeGame.questions[currentRound - 1].choices;
    expectAnswer.toBeCorrect(answers.find(isCorrect));
    expectAnswer.toBeIncorrect(answers.find(isIncorrect));
    answers.filter(isOther).forEach((answer) => {
      testContext.expectAnswer.toBeNeutral(answer);
    });
  });

  addTestToSateNode(config, "feedback.noAnswer", (testContext, state) => {
    const { currentRound } = state.context;
    const { expectAnswer } = testContext;
    const answers = fakeGame.questions[currentRound - 1].choices;
    expectAnswer.toBeCorrect(answers.find(isCorrect));
    expectAnswer.toBeNeutral(answers.find(isIncorrect));
    answers.filter(isOther).forEach((answer) => {
      testContext.expectAnswer.toBeNeutral(answer);
    });
  });

  addTestToSateNode(config, "gameOver", () => {});

  const context = {
    rounds: fakeGame.questions.length,
    currentRound: 0,
  };

  const testMachine = Machine(config, gameMachine.options).withContext(context);

  return testMachine;
}

function addTestToSateNode(machineConfig, path, test) {
  const stateNode = path
    .split(".")
    .map((p) => `states.${p}`)
    .join(".");

  const metaTestPath = `${stateNode}.meta.test`;
  _set(machineConfig, metaTestPath, test);
}

const expectAnswer = (component) => ({
  toBeCorrect: function toBeCorrect(answer) {
    const { getByTestId } = component;
    const answerNode = getByTestId(`answer-${answer.answer}`);
    const style = answerNode.getProp("style");
    expect(style).toBe(correctAnswerContainer);
  },

  toBeIncorrect: function toBeIncorrect(answer) {
    const { getByTestId } = component;
    const answerNode = getByTestId(`answer-${answer.answer}`);
    const style = answerNode.getProp("style");
    expect(style).toBe(incorrectAnswerContainer);
  },

  toBeNeutral: function toBeNeutral(answer) {
    const { getByTestId } = component;
    const answerNode = getByTestId(`answer-${answer.answer}`);
    const style = answerNode.getProp("style");
    expect(style).not.toBe(correctAnswerContainer);
    expect(style).not.toBe(incorrectAnswerContainer);
  },
});

describe("Game MDT", () => {
  const testPlans = gameModel.getSimplePathPlans();
  // const testPlans = gameModel.getShortestPathPlans();
  // const plan = testPlans[5];
  // const path = plan.paths[0];

  // it(`${plan.description} ${path.description}`, async () => {
  //   const props = mockNavigationProps(mockRouteParamsProps({ game: fakeGame }));
  //   const component = render(<Game {...props} />);

  //   await path.test({ props, component, expectAnswer: expectAnswer(component) });
  // });

  testPlans.forEach((plan) => {
    describe(plan.description, () => {
      plan.paths.forEach((path) => {
        it(path.description, async () => {
          const props = mockNavigationProps(mockRouteParamsProps({ game: fakeGame }));
          const component = render(<Game {...props} />);

          await path.test({ props, component, expectAnswer: expectAnswer(component) });
        });
      });
    });
  });

  it("should have full coverage", () => {
    return gameModel.testCoverage();
  });
});
