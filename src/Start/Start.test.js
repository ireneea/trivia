import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import Start from "./Start";
import { findByTestID, mockNavigationProps } from "../../utils/iaTest";

describe("Start", () => {
  it("should render correctly", () => {
    const { baseElement } = render(<Start />);
    expect(baseElement).toMatchSnapshot();
  });

  it("should navigate to the Game page", () => {
    const props = mockNavigationProps();

    const { getByText } = render(<Start {...props} />);
    fireEvent.press(getByText("Start"));

    expect(props.navigation.navigate).toHaveBeenCalledWith("Game");
  });
});
