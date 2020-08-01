import React from 'react'
import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/extend-expect'
import waitForExpect from 'wait-for-expect'

import RemoveUser from '../src/components/user/Delete'

afterEach(() => {
  jest.clearAllMocks();
});

test('handles errors', () => {
  jest.doMock('../src/components/endpoints/User', () => {
    return {
      EditUser: jest.fn((id, name, email) => {}),
      DeleteUser: jest.fn((id) => { 
        console.log('throwing')
        throw new Error('mock network error') }),
    }
  })


  const { getByRole, getByText } = render(
    <RemoveUser id="0" name="Jenny Doe" email="jenny@example.com" onDelete={() => expect(true).toBe(false)} />)

  userEvent.click(getByRole('button', { name: 'Delete' }))
  waitFor(() => getByRole('button', { name: 'Confirm' }))

  waitForExpect(() => {
    expect(getByText('Oh no!', { exact: false })).toHaveTextContent('mock network error')
  })
  waitForExpect(() => {
    expect(mockCallback).not.toHaveBeenCalled()
  })
})
