import React from "react";
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import User from '../src/components/cards/Display'

it("renders", () => {
   const { getByText } = render(<User id="0" name="Jenny Doe" email="jenny@example.com" />);
   expect(getByText('Jenny Doe')).toBeInTheDocument()
   expect(getByText('jenny@example.com')).toBeInTheDocument()

   fireEvent.click(screen.getByText('Edit'))
   waitFor(() => screen.getByRole('textbox'))

   expect(screen.getAllByRole('textbox')[0]).toHaveValue('Jenny Doe')
   expect(screen.getAllByRole('textbox')[1]).toHaveValue('jenny@example.com')
   expect(screen.getByRole('button', {name: 'Save'})).toHaveTextContent('Save')
});