import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/extend-expect'
import waitForExpect from 'wait-for-expect'

import RemoveUser from './Delete'

jest.mock('../../core/services/List')
jest.mock('../../core/services/User')

test('renders', () => {
  const { getByRole, queryByRole, queryByText } = render(
    <RemoveUser id="0" name="Jenny Doe" email="jenny@example.com" onDelete={() => expect(true).toBe(false)} />)

  userEvent.click(getByRole('button', { name: 'Delete' }))
  waitFor(() => getByRole('button', { name: 'Confirm' }))

  userEvent.type(queryByText('dangerous!', { exact: false }), '{esc}')
  expect(queryByRole('button', { name: 'Confirm' })).not.toBeInTheDocument()
})

test('default data on submit', async () => {
  const mockCallback = jest.fn()
  const { getByText, getByRole } = render(
    <RemoveUser id="0" name="Jenny Doe" email="jenny@example.com" onDelete={mockCallback} />)

  userEvent.click(getByText('Delete'))
  waitFor(() => getByRole('button', { name: 'Confirm' }))
  userEvent.click(getByRole('button', { name: 'Confirm' }))

  await waitForExpect(() => {
    expect(mockCallback).toHaveBeenCalled()
    expect(getByText('Success!', { exact: false })).toBeInTheDocument()
  }, 700)
})
