import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import waitForExpect from 'wait-for-expect'

import RemoveUser from './Delete'

jest.mock('../../core/services/User', () => {
  return {
    EditUser: jest.fn(),
    DeleteUser: jest.fn(() => { return new Promise((resolve, reject) => reject(new Error('mock network error'))) })
  }
})

test('handles errors', async () => {
  const user = { id: 0, name: 'Jenny Doe', email: 'jenny@example.com' }
  const mockCallback = jest.fn()
  const { getByRole, getByText } = render(<RemoveUser user={user} onDelete={mockCallback} />)

  userEvent.click(getByRole('button', { name: 'Delete' }))
  await waitFor(() => getByRole('button', { name: 'Confirm' }))
  userEvent.click(getByRole('button', { name: 'Confirm' }))

  await waitForExpect(() => {
    expect(mockCallback).not.toHaveBeenCalled()
    expect(getByText('Error: mock network error')).toBeInTheDocument()
  }, 700)
})
