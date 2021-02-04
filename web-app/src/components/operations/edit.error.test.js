import React from 'react'
import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/extend-expect'
import regeneratorRuntime from 'regenerator-runtime' // required for async
import waitForExpect from 'wait-for-expect'

import ModifyUser from './Edit'

jest.mock('../endpoints/User', () => {
  return {
    EditUser: jest.fn((id, name, email) => {
      console.log('throwing')
      return new Promise((resolve, reject) => reject(new Error('mock network error')))
    }),
    DeleteUser: jest.fn((id) => { })
  }
})

test('handles errors', async () => {
  const mockCallback = jest.fn((name, email) => { })
  const { getByText, getByRole } = render(<ModifyUser id="72" name="Jenny Doe" email="jenny@example.com"
    onChange={mockCallback} />)

  userEvent.click(getByText('Edit'))
  waitFor(() => getByRole('button', { name: 'Save' }))
  userEvent.click(getByRole('button', { name: 'Save' }))

  await waitForExpect(() => {
    expect(mockCallback).not.toHaveBeenCalled()
    expect(getByText('Error: mock network error')).toBeInTheDocument()
  }, 700)
})
