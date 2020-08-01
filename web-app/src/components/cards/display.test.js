import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import User from './Display'

test('renders', () => {
  const { getByText, getByRole } = render(<User id="0" name="Jenny Doe" email="jenny@example.com" />)
  expect(getByText('Jenny Doe')).toBeInTheDocument()
  expect(getByText('jenny@example.com')).toBeInTheDocument()
  expect(getByRole('button', { name: 'Edit' })).toHaveTextContent('Edit')
  expect(getByRole('button', { name: 'Delete' })).toHaveTextContent('Delete')
})
