import React from "react";
import { render } from "@testing-library/react-native";

import Question from "./Question";

describe("Question", () => {
  it("render Question correctly", () => {
    const { baseElement } = render(<Question />);
    expect(baseElement).toMatchSnapshot();
  });

  it("displays the question", () => {
    const question = { text: "one" };
    const { getByText } = render(<Question question={question} />);
    expect(getByText(question.text)).toBeTruthy();
  });
});
