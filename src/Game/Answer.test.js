import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import { correctAnswerContainer, incorrectAnswerContainer } from "./Answer";

import Answer from "./Answer";

describe("Answer", () => {
  const answer = { answer: "one" };

  it("displays the answer", () => {
    const { getByText } = render(<Answer answer={{ ...answer, answer: "two" }} />);
    expect(getByText("two")).toBeTruthy();
  });

  it("displays neutral by default", () => {
    const component = render(<Answer answer={answer} />);
    expectToBeNeural(component, answer);
  });

  it("displays as correct", () => {
    const component = render(<Answer answer={answer} isCorrect feedback />);
    expectToBeCorrect(component, answer);
  });

  it("correct answer displays neutral when feedback is not enabled", () => {
    const component = render(<Answer answer={answer} isCorrect />);
    expectToBeNeural(component, answer);
  });

  it("displays as incorrect", () => {
    const component = render(<Answer answer={answer} isIncorrect feedback selected />);
    expectToBeIncorrect(component, answer);
  });

  it("incorrect answer displays neutral when feedback is not enabled", () => {
    const component = render(<Answer answer={answer} isIncorrect />);
    expectToBeNeural(component, answer);
  });

  it("incorrect answer displays neutral when it's not selected", () => {
    const component = render(<Answer answer={answer} isIncorrect feedback />);
    expectToBeNeural(component, answer);
  });

  it("call the eventHandler when answer is pressed", () => {
    const onSelect = jest.fn();
    const { getByLabelText } = render(<Answer answer={answer} onSelect={onSelect} />);

    fireEvent.press(getByLabelText(answer.answer));
    expect(onSelect).toHaveBeenCalled();
  });

  it("do not call the eventHandler when answer is pressed", () => {
    const onSelect = jest.fn();
    const { getByLabelText } = render(<Answer answer={answer} onSelect={onSelect} feedback />);

    fireEvent.press(getByLabelText(answer.answer));
    expect(onSelect).not.toHaveBeenCalled();
  });
});

function expectToBeNeural(component, answer) {
  const { getByTestId } = component;

  const answerNode = getByTestId(`answer-${answer.answer}`);
  const style = answerNode.getProp("style");
  expect(style).not.toBe(correctAnswerContainer);
  expect(style).not.toBe(incorrectAnswerContainer);
}

function expectToBeCorrect(component, answer) {
  const { getByTestId } = component;

  const answerNode = getByTestId(`answer-${answer.answer}`);
  const style = answerNode.getProp("style");
  expect(style).toBe(correctAnswerContainer);
}

function expectToBeIncorrect(component, answer) {
  const { getByTestId } = component;

  const answerNode = getByTestId(`answer-${answer.answer}`);
  const style = answerNode.getProp("style");
  expect(style).toBe(incorrectAnswerContainer);
}
