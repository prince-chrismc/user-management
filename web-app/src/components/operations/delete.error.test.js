import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/extend-expect'
import waitForExpect from 'wait-for-expect'

import RemoveUser from './Delete'

jest.mock('../../core/services/User', () => {
  return {
    EditUser: jest.fn((id, name, email) => { }),
    DeleteUser: jest.fn((id) => { return new Promise((resolve, reject) => reject(new Error('mock network error'))) })
  }
})

test('handles errors', async () => {
  const mockCallback = jest.fn()
  const { getByRole, getByText } = render(
    <RemoveUser id="0" name="Jenny Doe" email="jenny@example.com" onDelete={mockCallback} />)

  userEvent.click(getByRole('button', { name: 'Delete' }))
  waitFor(() => getByRole('button', { name: 'Confirm' }))
  userEvent.click(getByRole('button', { name: 'Confirm' }))

  await waitForExpect(() => {
    expect(mockCallback).not.toHaveBeenCalled()
    expect(getByText('Error: mock network error')).toBeInTheDocument()
  }, 700)
})
