import React from "react";
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import User from '../src/components/cards/Display'

it("renders", () => {
   const { getByText } = render(<User id="0" name="Jenny Doe" email="jenny@example.com" />);
   expect(getByText('Jenny Doe')).toBeInTheDocument()
   expect(getByText('jenny@example.com')).toBeInTheDocument()
});