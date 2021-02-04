import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/extend-expect'
import waitForExpect from 'wait-for-expect'

import CreateUser from './Add'

jest.mock('../endpoints/List', () => {
  return {
    AddUser: jest.fn((name, email) => {
      console.log('throwing')
      return new Promise((resolve, reject) => reject(new Error('mock network error')))
    }),
    LoadUsers: jest.fn(() => { })
  }
})

test('handles errors', async () => {
  const mockCallback = jest.fn((id, name, email) => { })
  const { getByText, getByRole } = render(<CreateUser onAdd={mockCallback} />)

  userEvent.click(getByRole('button', { name: 'Add' }))
  waitFor(() => getByRole('button', { name: 'Save' }))
  userEvent.click(getByRole('button', { name: 'Save' }))

  await waitForExpect(() => {
    expect(mockCallback).not.toHaveBeenCalled()
    expect(getByText('Error: mock network error')).toBeInTheDocument()
  }, 700)
})
