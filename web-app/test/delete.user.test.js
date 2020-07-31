import React from 'react'
import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/extend-expect'
import waitForExpect from 'wait-for-expect'

import RemoveUser from '../src/components/user/Delete'

jest.mock('../src/components/endpoints/User')

test('renders', () => {
  const { getByRole, queryByRole } = render(
    <RemoveUser id="0" name="Jenny Doe" email="jenny@example.com"
      onDelete={() => { expect(true).toBe(false) }} />)

  userEvent.click(getByRole('button', { name: 'Delete' }))
  waitFor(() => getByRole('button', { name: 'Confirm' }))

  expect(queryByRole('button', { name: 'Confirm' })).toBeInTheDocument()

  userEvent.type(queryByRole('button', { name: 'Confirm' }), '{esc}')

  expect(queryByRole('button', { name: 'Confirm' })).not.toBeInTheDocument()
})

test('default data on submit', () => {
  const mockCallback = jest.fn(() => { })
  const { getByText, getByRole } = render(<RemoveUser id="0" name="Jenny Doe" email="jenny@example.com"
    onDelete={mockCallback} />)

  userEvent.click(getByText('Delete'))
  waitFor(() => getByRole('button', { name: 'Confirm' }))
  userEvent.click(getByRole('button', { name: 'Confirm' }))

  waitForExpect(() => {
    expect(mockCallback.mock.calls.length).toBe(1)
  })
})
