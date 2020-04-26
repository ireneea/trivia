import React from "react";
import { render } from "@testing-library/react-native";

import Answer from "./Answer";

describe("Answer", () => {
  const answer = { answer: "one" };
  it("render Answer correctly", () => {
    const { baseElement } = render(<Answer answer={answer} />);
    expect(baseElement).toMatchSnapshot();
  });

  it("displays the answer", () => {
    const { getByText } = render(
      <Answer answer={{ ...answer, answer: "two" }} />
    );
    expect(getByText("two")).toBeTruthy();
  });
});
