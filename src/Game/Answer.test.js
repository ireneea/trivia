import React from "react";
import { render } from "@testing-library/react-native";

import Answer from "./Answer";

describe("Answer", () => {
  it("render Answer correctly", () => {
    const { baseElement } = render(<Answer />);
    expect(baseElement).toMatchSnapshot();
  });

  it("displays the answer", () => {
    const answer = { answer: "one" };
    const { getByText } = render(<Answer answer={answer} />);
    expect(getByText(answer.answer)).toBeTruthy();
  });
});
