/**
 * @jest-environment jsdom
 */

 import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import waitForExpect from 'wait-for-expect'
import userEvent from '@testing-library/user-event'

import ModifyUser from './Edit'

jest.mock('../../core/services/List')
jest.mock('../../core/services/User')

test('renders', async () => {
  const user = { id: 0, name: 'Jenny Doe', email: 'jenny@example.com' }
  const mockCallback = jest.fn()
  const { getByText, getByRole, getByPlaceholderText } = render(<ModifyUser user={user} onChange={mockCallback} />)

  fireEvent.click(getByText('Edit'))
  await waitFor(() => getByRole('button', { name: 'Save' }))

  expect(getByPlaceholderText('Name')).toHaveValue('Jenny Doe')
  expect(getByPlaceholderText('Email')).toHaveValue('jenny@example.com')
  expect(getByRole('button', { name: 'Save' })).toHaveTextContent('Save')

  userEvent.type(getByPlaceholderText('Name'), '{esc}')

  expect(screen.queryByPlaceholderText('Name')).not.toBeInTheDocument()
  expect(screen.queryByPlaceholderText('Email')).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument()
  expect(mockCallback).not.toHaveBeenCalled()
})

test('default data on submit', async () => {
  const user = { id: 72, name: 'Jenny Doe', email: 'jenny@example.com' }
  const mockCallback = jest.fn()
  const { getByText, getByRole } = render(<ModifyUser user={user} onChange={mockCallback} />)

  userEvent.click(getByText('Edit'))
  await waitFor(() => getByRole('button', { name: 'Save' }))
  userEvent.click(getByRole('button', { name: 'Save' }))

  await waitForExpect(() => {
    expect(mockCallback).toHaveBeenCalledWith('Jenny Doe', 'jenny@example.com')
    expect(getByRole('button', { name: 'Save' })).toBeDisabled()
    expect(getByText('Success!', { exact: false })).toBeInTheDocument()
  }, 700)
})

test('new data on submit', async () => {
  const user = { id: 73, name: 'Jenny Doe', email: 'jenny@example.com' }
  const mockCallback = jest.fn()
  const { getByText, getByRole, getByPlaceholderText } = render(<ModifyUser user={user} onChange={mockCallback} />)

  userEvent.click(getByText('Edit'))
  await waitFor(() => getByRole('button', { name: 'Save' }))

  fireEvent.change(getByPlaceholderText('Name'), { target: { value: 'John Doe' } })
  fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'john@example.com' } })
  userEvent.click(getByRole('button', { name: 'Save' }))
  expect(mockCallback).not.toHaveBeenCalled()

  await waitForExpect(() => {
    expect(mockCallback).toHaveBeenCalledWith('John Doe', 'john@example.com')
    expect(getByRole('button', { name: 'Save' })).toBeDisabled()
    expect(getByText('Success!', { exact: false })).toBeInTheDocument()
  }, 700)
})
