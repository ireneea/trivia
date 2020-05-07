import React from "react";
import { render } from "@testing-library/react-native";

import Question from "./Question";

describe("Question", () => {
  it("displays the question", () => {
    const question = { text: "one" };
    const { getByText } = render(<Question question={question} />);
    expect(getByText(question.text)).toBeTruthy();
  });
});
