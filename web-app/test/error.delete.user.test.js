import React from 'react'
import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/extend-expect'

import RemoveUser from '../src/components/user/Delete'

test('handles errors', async () => {
  const mockCallback = jest.fn()
  const { getByRole, getByText } = render(
    <RemoveUser id="0" name="Jenny Doe" email="jenny@example.com" onDelete={mockCallback} />)

  userEvent.click(getByRole('button', { name: 'Delete' }))
  waitFor(() => getByRole('button', { name: 'Confirm' }))
  userEvent.click(getByRole('button', { name: 'Confirm' }))

  // await expect(getByText('mock network error')).toBeInTheDocument()
  await expect(mockCallback).not.toHaveBeenCalled()
})
