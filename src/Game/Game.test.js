import React from "react";
import { render, fireEvent, act } from "@testing-library/react-native";
import "@testing-library/jest-native/extend-expect";

import Game, { READ_ANSWER_TIME, ANSWER_TIME, ANSWER_BONUS_TIME_LIMIT } from "./Game";
import { correctAnswerContainer, incorrectAnswerContainer } from "./Answer";

import { mockNavigationProps, mockRouteParamsProps } from "../../utils";

const game = {
  questions: [
    {
      text: "Kampala is the capital of?",
      correctAnswer: "Uganda",
      choices: [{ answer: "Kenya" }, { answer: "Bhutan" }, { answer: "Uganda" }, { answer: "Rwanda" }],
    },
    {
      text: "Mogadishu is the capital of?",
      correctAnswer: "Somalia",
      choices: [{ answer: "Somalia" }, { answer: "Azerbaijan" }, { answer: "Angola" }, { answer: "Djibouti" }],
    },
  ],
};

describe("Game", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it("should have valid timers", () => {
    expect(ANSWER_TIME).toBeGreaterThan(0);
    expect(READ_ANSWER_TIME).toBeGreaterThan(0);
    expect(ANSWER_BONUS_TIME_LIMIT).toBeGreaterThan(0);
  });

  it("navigate to Score", () => {
    const props = mockNavigationProps();

    const { getByLabelText } = render(<Game {...props} />);
    fireEvent.press(getByLabelText("End Game"));

    expect(props.navigation.navigate).toHaveBeenCalledWith("Score");
  });

  it("render first question", () => {
    const { getByText } = render(<Game {...mockRouteParamsProps({ game })} />);
    const [firstQuestion] = game.questions;
    expect(getByText(firstQuestion.text)).toBeTruthy();
  });

  it("render answers", () => {
    const { getByLabelText } = render(<Game {...mockRouteParamsProps({ game })} />);
    const [firstQuestion] = game.questions;
    const { choices } = firstQuestion;

    choices.forEach(({ answer }) => {
      expect(getByLabelText(answer)).toBeTruthy();
    });
  });

  describe("answer questions", () => {
    // OPTIMIZE: these tests rely on the internal logic of selecting a stylesheet
    // this is far from ideal, but unfortunately I couldn't come up with a better solution

    function expectAnswerToBeCorrect(component, answer) {
      const { getByTestId } = component;
      const answerNode = getByTestId(`answer-${answer.answer}`);
      const style = answerNode.getProp("style");
      expect(style).toBe(correctAnswerContainer);
    }

    function expectAnswerToBeIncorrect(component, answer) {
      const { getByTestId } = component;
      const answerNode = getByTestId(`answer-${answer.answer}`);
      const style = answerNode.getProp("style");
      expect(style).toBe(incorrectAnswerContainer);
    }

    function expectAnswerToNeutral(component, answer) {
      const { getByTestId } = component;
      const answerNode = getByTestId(`answer-${answer.answer}`);
      const style = answerNode.getProp("style");
      expect(style).not.toBe(correctAnswerContainer);
      expect(style).not.toBe(incorrectAnswerContainer);
    }

    it("all answers be displayed as neutral when no answer has been selected", () => {
      const component = render(<Game {...mockRouteParamsProps({ game })} />);
      const [firstQuestion] = game.questions;
      firstQuestion.choices.forEach((answer) => {
        expectAnswerToNeutral(component, answer);
      });
    });

    it("display answer as correct and the rest as neutral when the correct answer is selected", () => {
      const component = render(<Game {...mockRouteParamsProps({ game })} />);

      const { getByLabelText } = component;
      const [firstQuestion] = game.questions;
      const correctAnswer = getCorrectAnswer(firstQuestion);

      fireEvent.press(getByLabelText(correctAnswer.answer));

      expectAnswerToBeCorrect(component, correctAnswer);

      const otherAnswers = firstQuestion.choices.filter(({ answer }) => answer !== correctAnswer.answer);

      otherAnswers.forEach((answer) => {
        expectAnswerToNeutral(component, answer);
      });
    });

    it("display answer as incorrect when the incorrect answer is selected", () => {
      const component = render(<Game {...mockRouteParamsProps({ game })} />);

      const { getByLabelText } = component;

      const [firstQuestion] = game.questions;
      const correctAnswer = getCorrectAnswer(firstQuestion);
      const incorrect = getIncorrectAnswer(firstQuestion);

      fireEvent.press(getByLabelText(incorrect.answer));

      expectAnswerToBeCorrect(component, correctAnswer);
      expectAnswerToBeIncorrect(component, incorrect);

      const otherAnswers = firstQuestion.choices.filter(
        ({ answer }) => answer !== correctAnswer.answer && answer !== incorrect.answer
      );

      otherAnswers.forEach((answer) => {
        expectAnswerToNeutral(component, answer);
      });
    });

    it("does not change feedback information ", () => {
      const component = render(<Game {...mockRouteParamsProps({ game })} />);

      const { getByLabelText } = component;

      const [firstQuestion] = game.questions;
      const correctAnswer = getCorrectAnswer(firstQuestion);
      const incorrect = getIncorrectAnswer(firstQuestion);
      const otherAnswers = firstQuestion.choices.filter(
        ({ answer }) => answer !== correctAnswer.answer && answer !== incorrect.answer
      );

      fireEvent.press(getByLabelText(incorrect.answer));
      fireEvent.press(getByLabelText(correctAnswer.answer));

      expectAnswerToBeCorrect(component, correctAnswer);
      expectAnswerToBeIncorrect(component, incorrect);

      otherAnswers.forEach((answer) => {
        expectAnswerToNeutral(component, answer);
      });
    });

    it("show the second answer after the first answer has been answered", async () => {
      const component = render(<Game {...mockRouteParamsProps({ game })} />);

      const [firstQuestion, secondQuestion] = game.questions;
      const correctAnswer = getCorrectAnswer(firstQuestion);

      fireEvent.press(component.getByLabelText(correctAnswer.answer));

      act(() => jest.advanceTimersByTime(READ_ANSWER_TIME));

      expect(component.getByText(secondQuestion.text)).toBeTruthy();
    });

    it("show the second answer if the first question is never answered", async () => {
      const component = render(<Game {...mockRouteParamsProps({ game })} />);
      const [, secondQuestion] = game.questions;

      act(() => jest.advanceTimersByTime(ANSWER_TIME));
      act(() => jest.advanceTimersByTime(READ_ANSWER_TIME));
      expect(component.getByText(secondQuestion.text)).toBeTruthy();
    });

    it("end the game after all the questions have been answered", async () => {
      const props = mockNavigationProps(mockRouteParamsProps({ game }));
      const component = render(<Game {...props} />);

      const [first, last] = game.questions;

      fireEvent.press(component.getByLabelText(getCorrectAnswer(first).answer));
      act(() => jest.advanceTimersByTime(READ_ANSWER_TIME));

      fireEvent.press(component.getByLabelText(getCorrectAnswer(last).answer));
      act(() => jest.advanceTimersByTime(READ_ANSWER_TIME));

      expect(props.navigation.navigate).toHaveBeenCalledWith("Score");
    });
  });

  describe("scoring", () => {
    it("should be 0 by default", () => {
      const component = render(<Game {...mockRouteParamsProps({ game })} />);
      expect(component.getByHintText("score")).toHaveTextContent("0");
    });

    it("should add 100 points for non bonus questions", () => {
      const component = render(<Game {...mockRouteParamsProps({ game })} />);
      const [firstQuestion] = game.questions;

      act(() => jest.advanceTimersByTime(ANSWER_BONUS_TIME_LIMIT));
      fireEvent.press(component.getByLabelText(getCorrectAnswer(firstQuestion).answer));
      expect(component.getByHintText("score")).toHaveTextContent("100");
    });

    it("should add bonus point for quick answer", () => {
      const component = render(<Game {...mockRouteParamsProps({ game })} />);
      const [firstQuestion] = game.questions;

      fireEvent.press(component.getByLabelText(getCorrectAnswer(firstQuestion).answer));
      const bonus = Math.round(ANSWER_BONUS_TIME_LIMIT / 100) + 100;
      expect(component.getByHintText("score")).toHaveTextContent(`${bonus}`);
    });

    it("should not add points if the question is incorrect", () => {
      const component = render(<Game {...mockRouteParamsProps({ game })} />);
      const [firstQuestion] = game.questions;

      fireEvent.press(component.getByLabelText(getIncorrectAnswer(firstQuestion).answer));
      expect(component.getByHintText("score")).toHaveTextContent("0");
    });

    it("should not add points if the there is a time out", () => {
      const component = render(<Game {...mockRouteParamsProps({ game })} />);
      const [firstQuestion] = game.questions;

      act(() => jest.advanceTimersByTime(ANSWER_TIME));
      fireEvent.press(component.getByLabelText(getIncorrectAnswer(firstQuestion).answer));
      expect(component.getByHintText("score")).toHaveTextContent("0");
    });

    it("score should be incremented", () => {
      const component = render(<Game {...mockRouteParamsProps({ game })} />);
      const [firstQuestion, secondQuestion] = game.questions;

      // initial score
      expect(component.getByHintText("score")).toHaveTextContent("0");

      // no bonus score
      act(() => jest.advanceTimersByTime(ANSWER_BONUS_TIME_LIMIT));
      fireEvent.press(component.getByLabelText(getCorrectAnswer(firstQuestion).answer));
      expect(component.getByHintText("score")).toHaveTextContent("100");

      // bonus questions
      act(() => jest.advanceTimersByTime(READ_ANSWER_TIME));
      fireEvent.press(component.getByLabelText(getCorrectAnswer(secondQuestion).answer));
      const bonus = Math.round(ANSWER_BONUS_TIME_LIMIT / 100) + 200;
      expect(component.getByHintText("score")).toHaveTextContent(`${bonus}`);
    });
  });
});

const getCorrectAnswer = (question) => question.choices.find(({ answer }) => answer === question.correctAnswer);
const getIncorrectAnswer = (question) => question.choices.find(({ answer }) => answer !== question.correctAnswer);
