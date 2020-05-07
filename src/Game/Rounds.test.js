import React from "react";
import { render } from "@testing-library/react-native";

import Rounds from "./Rounds";

describe("Rounds", () => {
  it("show the right played and remaining rounds", async () => {
    const component = render(<Rounds rounds={10} currentRound={3} />);
    const playedRounds = await component.findAllByTestId("playedRound");
    const remainingRounds = await component.findAllByTestId("remainingRound");

    expect(playedRounds).toHaveLength(3);
    expect(remainingRounds).toHaveLength(7);
  });
});
