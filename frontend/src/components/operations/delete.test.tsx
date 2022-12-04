/**
 * @jest-environment jsdom
 */

import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import waitForExpect from 'wait-for-expect'

import RemoveUser from './Delete'

jest.mock('../../core/services/List')
jest.mock('../../core/services/User')

test('renders', async () => {
  const user = { id: 0, name: 'Jenny Doe', email: 'jenny@example.com' }
  const mockCallback = jest.fn()
  const { getByRole, queryByRole, queryByText } = render(<RemoveUser user={user} onDelete={mockCallback} />)

  userEvent.click(getByRole('button', { name: 'Delete' }))
  await waitFor(() => getByRole('button', { name: 'Confirm' }))

  userEvent.type(queryByText('dangerous!', { exact: false }), '{esc}')
  expect(queryByRole('button', { name: 'Confirm' })).not.toBeInTheDocument()
  expect(mockCallback).not.toHaveBeenCalled()
})

test('default data on submit', async () => {
  const user = { id: 0, name: 'Jenny Doe', email: 'jenny@example.com' }
  const mockCallback = jest.fn()
  const { getByText, getByRole } = render(<RemoveUser user={user} onDelete={mockCallback} />)

  userEvent.click(getByText('Delete'))
  await waitFor(() => getByRole('button', { name: 'Confirm' }))
  userEvent.click(getByRole('button', { name: 'Confirm' }))

  await waitForExpect(() => {
    expect(mockCallback).toHaveBeenCalled()
    expect(getByText('Success!', { exact: false })).toBeInTheDocument()
  }, 700)
})
