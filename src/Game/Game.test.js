import React from "react";
import renderer, { act } from "react-test-renderer";

import Game from "./Game";
import { findByTestID, mockNavigationProps } from "../../utils/iaTest";

describe("Game", () => {
  it("render Game correctly", () => {
    const gameRenderer = renderer.create(<Game />);
    expect(gameRenderer.toJSON()).toMatchSnapshot();
  });

  it("navigate to Score", () => {
    const props = mockNavigationProps();
    const gameRenderer = renderer.create(<Game {...props} />);

    act(() => {
      findByTestID(gameRenderer.root, "endGameBtn").props.onPress();
    });

    expect(props.navigation.navigate).toHaveBeenCalledWith("Score");
  });
});
