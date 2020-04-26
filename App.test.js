import React from "react";
import renderer from "react-test-renderer";

import App from "./App.tsx";
import Routes from "./src/Routes";

describe("<App />", () => {
  it("renders the routes component", () => {
    const appRenderer = renderer.create(<App />);
    appRenderer.root.findByType(Routes);
  });
});
