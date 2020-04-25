import React from "react";
import renderer, { act } from "react-test-renderer";

import Start from "./Start";
import { findByTestID, mockNavigationProps } from "../../utils/iaTest";

describe("Start", () => {
  it("should render correctly", () => {
    const startRenderer = renderer.create(<Start />);
    expect(startRenderer.toJSON()).toMatchSnapshot();
  });

  it("should navigate to the Game page", () => {
    const props = mockNavigationProps();
    const startRenderer = renderer.create(<Start {...props} />);

    act(() => {
      findByTestID(startRenderer.root, "startBtn").props.onPress();
    });

    expect(props.navigation.navigate).toHaveBeenCalledWith("Game");
  });
});
