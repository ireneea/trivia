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

  it("apply `correctAnswerContainer` when the answer is incorrect", () => {
    const { getByTestId } = render(<Answer answer={answer} isCorrect />);

    const answerNode = getByTestId(`answer-${answer.answer}`);
    const style = answerNode.getProp("style");
    expect(style).toBe(correctAnswerContainer);
  });

  it("apply `incorrectAnswerContainer` when the answer is incorrect", () => {
    const { getByTestId } = render(<Answer answer={answer} isIncorrect />);

    const answerNode = getByTestId(`answer-${answer.answer}`);
    const style = answerNode.getProp("style");
    expect(style).toBe(incorrectAnswerContainer);
  });

  it("do not apply any specific style when the answer is neither correct or incorrect", () => {
    const { getByTestId } = render(<Answer answer={answer} />);

    const answerNode = getByTestId(`answer-${answer.answer}`);
    const style = answerNode.getProp("style");
    expect(style).not.toBe(correctAnswerContainer);
    expect(style).not.toBe(incorrectAnswerContainer);
  });

  it("call the eventHandler when answer is pressed", () => {
    const onSelect = jest.fn();
    const { getByLabelText } = render(<Answer answer={answer} onSelect={onSelect} />);

    fireEvent.press(getByLabelText(answer.answer));
    expect(onSelect).toHaveBeenCalled();
  });
});
