import React from "react";
import renderer, { act } from "react-test-renderer";

import Score from "./Score";
import { findByTestID, mockNavigationProps } from "../../utils/iaTest";

describe("Score", () => {
  it("render Score correctly", () => {
    const scoreRenderer = renderer.create(<Score />);
    expect(scoreRenderer.toJSON()).toMatchSnapshot();
  });

  it("navigate to Game", () => {
    const props = mockNavigationProps();
    const scoreRenderer = renderer.create(<Score {...props} />);

    act(() => {
      findByTestID(scoreRenderer.root, "newGameBtn").props.onPress();
    });

    expect(props.navigation.navigate).toHaveBeenCalledWith("Game");
  });

  it("navigate to Start", () => {
    const props = mockNavigationProps();
    const scoreRenderer = renderer.create(<Score {...props} />);

    act(() => {
      findByTestID(scoreRenderer.root, "homeBtn").props.onPress();
    });

    expect(props.navigation.navigate).toHaveBeenCalledWith("Start");
  });
});
