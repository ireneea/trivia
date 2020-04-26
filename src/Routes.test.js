import React from "react";
import { render, fireEvent, act } from "@testing-library/react-native";

import renderer from "react-test-renderer";

import Routes from "./Routes";

describe("Routes", () => {
  it("Start Screen is the initial screen", () => {
    const { getByTestId } = render(<Routes />);
    expect(getByTestId("startScreen")).toBeTruthy();
  });

  it.skip("Navigate Between screen", async () => {
    // TODO: find a good way to test the navigation
  });
});
