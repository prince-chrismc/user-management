import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import User from '../src/components/User'

let container = null;
beforeEach(() => {
   // setup a DOM element as a render target
   container = document.createElement("div");
   document.body.appendChild(container);
});

afterEach(() => {
   // cleanup on exiting
   unmountComponentAtNode(container);
   container.remove();
   container = null;
});

it("renders with or without a name", () => {
   act(() => {
      render(<User name="Jenny Doe" email="jenny@example.com"/>, container);
   });
   expect(container.textContent).toContain("Jenny Doe");
   expect(container.textContent).toContain("jenny@example.com");
});