import React from "react";
import renderer from "react-test-renderer";
import { render } from "@testing-library/react-native";

import App from "./App.tsx";
import Routes from "./src/Routes";

describe("<App />", () => {
  let appRenderer;

  beforeAll(() => {
    appRenderer = renderer.create(<App />);
  });

  it("renders correctly", () => {
    expect(appRenderer.toJSON()).toMatchSnapshot();
  });

  it("renders the routes component", () => {
    appRenderer.root.findByType(Routes);
  });
});
