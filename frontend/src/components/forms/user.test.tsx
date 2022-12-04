/**
 * @jest-environment jsdom
 */

import { render, fireEvent } from '@testing-library/react'
import waitForExpect from 'wait-for-expect'
import userEvent from '@testing-library/user-event'

import UserForm from './User'

test('renders enabled', () => {
  const user = { id: 0, name: 'Jenny Doe', email: 'jenny@example.com' }
  const mockCallback = jest.fn()
  const { getByPlaceholderText, getByRole } = render(<UserForm user={user} handleSubmit={mockCallback} />)

  expect(getByPlaceholderText('Name')).toHaveValue('Jenny Doe')
  expect(getByPlaceholderText('Email')).toHaveValue('jenny@example.com')
  expect(getByRole('button', { name: 'Save' })).toHaveTextContent('Save')
  expect(getByRole('button', { name: 'Save' })).not.toBeDisabled()
  expect(mockCallback).not.toHaveBeenCalled()
})

test('renders disabled', () => {
  const user = { id: 0, name: 'Jenny Doe', email: 'jenny@example.com' }
  const mockCallback = jest.fn()
  const { getByPlaceholderText, getByRole } = render(<UserForm user={user} handleSubmit={mockCallback} disabled />)

  expect(getByPlaceholderText('Name')).toHaveValue('Jenny Doe')
  expect(getByPlaceholderText('Email')).toHaveValue('jenny@example.com')
  expect(getByRole('button', { name: 'Save' })).toHaveTextContent('Save')
  expect(getByRole('button', { name: 'Save' })).toBeDisabled()
  expect(mockCallback).not.toHaveBeenCalled()
})

test('handles submissions', async () => {
  const user = { id: 0, name: 'Jenny Doe', email: 'jenny@example.com' }
  const mockCallback = jest.fn()
  const { getByPlaceholderText, getByRole } = render(<UserForm user={user} handleSubmit={mockCallback} />)

  fireEvent.change(getByPlaceholderText('Name'), { target: { value: 'Jane Doe' } })
  fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'jane@example.com' } })
  userEvent.click(getByRole('button', { name: 'Save' }))

  await waitForExpect(() => {
    expect(mockCallback).toHaveBeenCalledWith('Jane Doe', 'jane@example.com')
  }, 700)
})
