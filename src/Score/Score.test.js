import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import "@testing-library/jest-native/extend-expect";

import Score from "./Score";
import { mockNavigationProps, mockRouteParamsProps } from "../../utils";

import { AnswerResult } from "../ts/appTypes";

describe("Score", () => {
  describe("navigation", () => {
    it("navigate to Game", async () => {
      const props = { ...mockNavigationProps(), ...mockRouteParamsProps({}) };

      const { getByText } = render(<Score {...props} />);
      fireEvent.press(getByText("New Game"));

      expect(props.navigation.navigate).toHaveBeenCalledWith("Game");
    });

    it("navigate to Start", () => {
      const props = { ...mockNavigationProps(), ...mockRouteParamsProps({}) };

      const { getByText } = render(<Score {...props} />);
      fireEvent.press(getByText("Home"));

      expect(props.navigation.navigate).toHaveBeenCalledWith("Start");
    });
  });

  describe("scores", () => {
    it("show the points", () => {
      const props = mockRouteParamsProps({ points: 213 });
      const component = render(<Score {...props} />);
      expect(component.queryByTestId("points")).toHaveTextContent("213");
    });

    it("show the bonus points", () => {
      const results = {
        "1": AnswerResult.INCORRECT,
        "2": AnswerResult.CORRECT,
        "3": AnswerResult.NO_ANSWER,
        "4": AnswerResult.CORRECT,
      };

      const props = mockRouteParamsProps({ points: 254, results });

      const component = render(<Score {...props} />);
      expect(component.queryByTestId("bonus")).toHaveTextContent("54");
    });

    it("show average time", () => {
      // TODO: display the average time
    });

    it("show correct, incorrect and unanswered counts", () => {
      const results = {
        "1": AnswerResult.INCORRECT,
        "2": AnswerResult.CORRECT,
        "3": AnswerResult.NO_ANSWER,
        "4": AnswerResult.CORRECT,
      };
      const props = mockRouteParamsProps({ results });

      const component = render(<Score {...props} />);
      expect(component.queryByTestId("correct")).toHaveTextContent("2");
      expect(component.queryByTestId("incorrect")).toHaveTextContent("1");
      expect(component.queryByTestId("unanswered")).toHaveTextContent("1");
    });
  });
});
