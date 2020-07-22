import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import User from '../src/components/cards/Display'

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

it("renders", () => {
   act(() => {
      render(<User id="0" name="Jenny Doe" email="jenny@example.com"/>, container);
   });
   expect(container.textContent).toContain("Jenny Doe");
   expect(container.textContent).toContain("jenny@example.com");
});