import React from 'react'
import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/extend-expect'
import regeneratorRuntime from 'regenerator-runtime' // required for async

import RemoveUser from '../src/components/user/Delete'

jest.mock('../src/components/endpoints/User', () => {
  return {
    EditUser: jest.fn((id, name, email) => { }),
    DeleteUser: jest.fn((id) => {
      console.log('throwing')
      return new Promise((resolve, reject) => reject(new Error('mock network error')))
    })
  }
})

afterEach(() => {
  jest.clearAllMocks()
})

test('handles errors', async () => {
  const mockCallback = jest.fn()
  const { getByRole, getByText } = render(
    <RemoveUser id="0" name="Jenny Doe" email="jenny@example.com" onDelete={mockCallback} />)

  userEvent.click(getByRole('button', { name: 'Delete' }))
  waitFor(() => getByRole('button', { name: 'Confirm' }))
  userEvent.click(getByRole('button', { name: 'Confirm' }))

  await new Promise(resolve => setTimeout(resolve, 100))

  expect(getByText('Error: mock network error')).toBeInTheDocument()
  expect(mockCallback).not.toHaveBeenCalled()
})
