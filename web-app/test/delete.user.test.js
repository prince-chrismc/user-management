import React from 'react'
import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/extend-expect'
import waitForExpect from 'wait-for-expect' // TODO: remove - unreliable

import RemoveUser from '../src/components/user/Delete'

jest.mock('../src/components/endpoints/User')

afterEach(() => {
  jest.clearAllMocks();
});

// test('renders', () => {
//   const { getByRole, queryByRole, queryByText } = render(
//     <RemoveUser id="0" name="Jenny Doe" email="jenny@example.com" onDelete={() => expect(true).toBe(false)} />)

//   userEvent.click(getByRole('button', { name: 'Delete' }))
//   waitFor(() => getByRole('button', { name: 'Confirm' }))

//   expect(queryByRole('button', { name: 'Confirm' })).toBeInTheDocument()

//   userEvent.type(queryByText('dangerous!', { exact: false }), '{esc}')

//   expect(queryByRole('button', { name: 'Confirm' })).not.toBeInTheDocument()
// })

// test('default data on submit', () => {
//   const mockCallback = jest.fn()
//   const { getByText, getByRole } = render(
//     <RemoveUser id="0" name="Jenny Doe" email="jenny@example.com" onDelete={mockCallback} />)

//   userEvent.click(getByText('Delete'))
//   waitFor(() => getByRole('button', { name: 'Confirm' }))
//   userEvent.click(getByRole('button', { name: 'Confirm' }))

//   waitForExpect(() => {
//     expect(mockCallback).toHaveBeenCalled()
//   })

//   expect(getByText('Success!', { exact: false })).toBeInTheDocument()
// })

jest.useFakeTimers();

test('handles errors', async () => {
  const mockCallback = jest.fn()
  const { getByRole, getByText } = render(
    <RemoveUser id="0" name="Jenny Doe" email="jenny@example.com" onDelete={mockCallback} />)

  userEvent.click(getByRole('button', { name: 'Delete' }))
  await waitFor(() => getByRole('button', { name: 'Confirm' }))
  userEvent.click(getByRole('button', { name: 'Confirm' }))
  
  // Fast-forward until all timers have been executed
  jest.runAllTimers();

  // expect(setTimeout).not.toHaveBeenCalled(mockCallback, 1000);

  // await expect(getByText('mock network error')).toBeInTheDocument()
  await expect(mockCallback).not.toHaveBeenCalled()
})