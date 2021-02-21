import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import waitForExpect from 'wait-for-expect'

import CreateUser from './Add'

jest.mock('../../core/services/List', () => {
  return {
    AddUser: jest.fn(() => {
      return new Promise((resolve, reject) => reject(new Error('mock network error')))
    }),
    LoadUsers: jest.fn()
  }
})

test('handles errors', async () => {
  const mockCallback = jest.fn()
  const { getByText, getByRole } = render(<CreateUser onAdd={mockCallback} />)

  userEvent.click(getByRole('button', { name: 'Add' }))
  await waitFor(() => getByRole('button', { name: 'Save' }))
  userEvent.click(getByRole('button', { name: 'Save' }))

  await waitForExpect(() => {
    expect(mockCallback).not.toHaveBeenCalled()
    expect(getByText('Error: mock network error')).toBeInTheDocument()
  }, 700)
})
