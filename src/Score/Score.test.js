import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import Score from "./Score";
import { mockNavigationProps } from "../../utils/iaTest";

describe("Score", () => {
  it("render Score correctly", () => {
    const { baseElement } = render(<Score />);
    expect(baseElement).toMatchSnapshot();
  });

  it("navigate to Game", async () => {
    const props = mockNavigationProps();

    const { getByText } = render(<Score {...props} />);
    fireEvent.press(getByText("New Game"));

    expect(props.navigation.navigate).toHaveBeenCalledWith("Game");
  });

  it("navigate to Start", () => {
    const props = mockNavigationProps();

    const { getByText } = render(<Score {...props} />);
    fireEvent.press(getByText("Home"));

    expect(props.navigation.navigate).toHaveBeenCalledWith("Start");
  });
});
