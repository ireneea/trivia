import React from "react";
import renderer from "react-test-renderer";

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

  it("has 1 child", () => {
    const tree = appRenderer.toJSON();
    expect(tree.children.length).toBe(1);
  });

  it("renders the routes component", () => {
    appRenderer.root.findByType(Routes);
  });
});
