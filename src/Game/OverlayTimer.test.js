import React from "react";

import OverlayTimer from "./OverlayTimer";
import { render, fireEvent, act } from "@testing-library/react-native";

describe("OverlayTimer", () => {
  const testData = [
    // basic
    { props: { totalTime: 100, timeLeft: 0 }, expected: "100%" },
    { props: { totalTime: 100, timeLeft: 10 }, expected: "90%" },
    { props: { totalTime: 100, timeLeft: 50 }, expected: "50%" },
    { props: { totalTime: 100, timeLeft: 90 }, expected: "10%" },

    // round
    { props: { totalTime: 2189, timeLeft: 178 }, expected: "92%" },

    // over 100%
    { props: { totalTime: 2189, timeLeft: 3000 }, expected: "0%" },
  ];

  testData.forEach(({ props, expected }) => {
    it(`height should be ${expected} for ${JSON.stringify(props)}`, () => {
      const component = render(<OverlayTimer {...props} />);
      expectHeightToBe(component, expected);
    });
  });

  it("should not have height if no parameter is passed", () => {
    const component = render(<OverlayTimer />);
    expectHeightToBe(component, "0%");
  });

  it("should not have height if total time is a negative number", () => {
    const component = render(<OverlayTimer totalTime={-10} timeLeft={20} />);
    expectHeightToBe(component, "0%");
  });

  it("should not have height if total time is 0", () => {
    const component = render(<OverlayTimer totalTime={0} timeLeft={20} />);
    expectHeightToBe(component, "0%");
  });

  it("should not have a height if the timeLeft is not a positive number", () => {
    const component = render(<OverlayTimer totalTime={100} timeLeft={-20} />);
    expectHeightToBe(component, "0%");
  });
});

function expectHeightToBe(component, expected) {
  const overlay = component.getByTestId("overlay");
  const style = overlay.getProp("style");

  expect(style.height).toBe(expected);
}
