import React from "react";
import { render } from "@testing-library/react-native";

import Rounds from "./Rounds";
import { AnswerResult } from "../ts/appTypes";

describe("Rounds", () => {
  it("should show the current round as neutral is there is no result", async () => {
    const component = render(<Rounds rounds={2} currentRound={2} results={{ "1": AnswerResult.CORRECT }} />);
    const currentRounds = await component.findAllByTestId("current");
    expect(currentRounds).toHaveLength(1);
  });

  it("should show the current round as fail if there is an incorrect result", async () => {
    const component = render(
      <Rounds rounds={2} currentRound={2} results={{ "1": AnswerResult.CORRECT, "2": AnswerResult.INCORRECT }} />
    );
    const failedRounds = await component.findAllByTestId("fail");
    expect(failedRounds).toHaveLength(1);
  });

  it("should show the current round as success if there is an correct result", async () => {
    const component = render(
      <Rounds rounds={2} currentRound={2} results={{ "1": AnswerResult.NO_ANSWER, "2": AnswerResult.CORRECT }} />
    );
    const successRounds = await component.findAllByTestId("success");
    expect(successRounds).toHaveLength(1);
  });

  it("should show correct rounds results", async () => {
    const results = {
      "1": AnswerResult.CORRECT,
      "2": AnswerResult.NO_ANSWER,
      "3": AnswerResult.CORRECT,
      "4": AnswerResult.INCORRECT,
      "5": AnswerResult.INCORRECT,
    };
    const component = render(<Rounds rounds={10} currentRound={6} results={results} />);
    const currentRounds = await component.findAllByTestId("current");
    const successRounds = await component.findAllByTestId("success");
    const failedRounds = await component.findAllByTestId("fail");
    const inactiveRounds = await component.findAllByTestId("inactive");

    expect(currentRounds).toHaveLength(1);
    expect(successRounds).toHaveLength(2);
    expect(failedRounds).toHaveLength(3);
    expect(inactiveRounds).toHaveLength(4);
  });
});
