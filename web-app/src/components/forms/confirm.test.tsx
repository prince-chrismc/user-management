/**
 * @jest-environment jsdom
 */

 import { render } from '@testing-library/react'
import waitForExpect from 'wait-for-expect'
import userEvent from '@testing-library/user-event'

import ConfirmForm from './Confirm'

test('renders', () => {
  const mockCallback = jest.fn()
  const { getByRole } = render(<ConfirmForm handleSubmit={mockCallback} />)

  expect(getByRole('button', { name: 'Confirm' })).toHaveTextContent('Confirm')
  expect(mockCallback).not.toHaveBeenCalled()
})

test('renders disabled', () => {
  const mockCallback = jest.fn()
  const { getByRole } = render(<ConfirmForm handleSubmit={mockCallback} disabled />)

  expect(getByRole('button', { name: 'Confirm' })).toHaveTextContent('Confirm')
  expect(getByRole('button', { name: 'Confirm' })).toBeDisabled()
  expect(mockCallback).not.toHaveBeenCalled()
})

test('handles submissions', async () => {
  const mockCallback = jest.fn()
  const { getByRole } = render(<ConfirmForm handleSubmit={mockCallback} />)

  userEvent.click(getByRole('button', { name: 'Confirm' }))

  await waitForExpect(() => {
    expect(mockCallback).toHaveBeenCalled()
  }, 700)
})
