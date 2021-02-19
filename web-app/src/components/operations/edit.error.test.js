import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/extend-expect'
import waitForExpect from 'wait-for-expect'

import ModifyUser from './Edit'

jest.mock('../../core/services/User', () => {
  return {
    EditUser: jest.fn(() => { return new Promise((resolve, reject) => reject(new Error('mock network error'))) }),
    DeleteUser: jest.fn()
  }
})

test('handles errors', async () => {
  const user = { id: 72, name: 'Jenny Doe', email: 'jenny@example.com' }
  const mockCallback = jest.fn()
  const { getByText, getByRole } = render(<ModifyUser user={user} onChange={mockCallback} />)

  userEvent.click(getByText('Edit'))
  await waitFor(() => getByRole('button', { name: 'Save' }))
  userEvent.click(getByRole('button', { name: 'Save' }))

  await waitForExpect(() => {
    expect(mockCallback).not.toHaveBeenCalled()
    expect(getByText('Error: mock network error')).toBeInTheDocument()
  }, 700)
})
