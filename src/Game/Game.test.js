import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import Game from "./Game";

import { mockNavigationProps, mockRouteParamsProps } from "../../utils/iaTest";

const game = {
  questions: [
    {
      text: "Kampala is the capital of",
      correctAnswer: "two",
      choices: [
        { answer: "one" },
        { answer: "two" },
        { answer: "three" },
        { answer: "four" },
      ],
    },
  ],
};

describe("Game", () => {
  it("render Game correctly", () => {
    const { baseElement } = render(<Game />);
    expect(baseElement).toMatchSnapshot();
  });

  it("navigate to Score", () => {
    const props = mockNavigationProps();

    const { getByText } = render(<Game {...props} />);
    fireEvent.press(getByText("End Game"));

    expect(props.navigation.navigate).toHaveBeenCalledWith("Score");
  });

  it("render first question", () => {
    const { getByText } = render(<Game {...mockRouteParamsProps({ game })} />);
    const [firstQuestion] = game.questions;
    expect(getByText(firstQuestion.text)).toBeTruthy();
  });

  it("render answers", () => {
    const { getByText } = render(<Game {...mockRouteParamsProps({ game })} />);
    const [firstQuestion] = game.questions;
    const { choices } = firstQuestion;

    expect(getByText(choices[0].answer)).toBeTruthy();
    expect(getByText(choices[1].answer)).toBeTruthy();
    expect(getByText(choices[2].answer)).toBeTruthy();
    expect(getByText(choices[3].answer)).toBeTruthy();
  });
});
