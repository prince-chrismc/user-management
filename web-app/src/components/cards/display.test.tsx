import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import waitForExpect from 'wait-for-expect'
import userEvent from '@testing-library/user-event'

import User from './Display'

jest.mock('../../core/services/List')
jest.mock('../../core/services/User')

test('renders', () => {
  const user = { id: 0, name: 'Jenny Doe', email: 'jenny@example.com' }
  const { getByText, getByRole } = render(<User user={user} />)
  expect(getByText('Jenny Doe')).toBeInTheDocument()
  expect(getByText('jenny@example.com')).toBeInTheDocument()
  expect(getByRole('button', { name: 'Edit' })).toHaveTextContent('Edit')
  expect(getByRole('button', { name: 'Delete' })).toHaveTextContent('Delete')
})

test('updates on edit', async () => {
  const user = { id: 37, name: 'Jenny Doe', email: 'jenny@example.com' }
  const mockCallback = jest.fn()
  const { container, getByPlaceholderText, getByRole, getByText } = render(
    <User user={user} onDelete={mockCallback} />)

  userEvent.click(getByRole('button', { name: 'Edit' }))
  await waitFor(() => getByRole('button', { name: 'Save' }))

  fireEvent.change(getByPlaceholderText('Name'), { target: { value: 'John Doe' } })
  fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'john@example.com' } })
  userEvent.click(getByRole('button', { name: 'Save' }))
  expect(mockCallback).not.toHaveBeenCalled()

  await waitForExpect(() => {
    expect(mockCallback).not.toHaveBeenCalled()
    expect(getByRole('button', { name: 'Save' })).toBeDisabled()
    expect(getByText('Success!', { exact: false })).toBeInTheDocument()
  }, 700)

  expect(container.querySelector('i')).toBeInTheDocument()
  userEvent.click(container.querySelector('i'))

  // expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument() // TODO: why is this not closed
  expect(screen.queryByText('Jenny Doe')).not.toBeInTheDocument()
  expect(screen.queryByText('jenny@example.com')).not.toBeInTheDocument()

  expect(getByText('John Doe')).toBeInTheDocument()
  expect(getByText('john@example.com')).toBeInTheDocument()
  expect(mockCallback).not.toHaveBeenCalled()
})

test('notifies id on delete', async () => {
  const user = { id: 27, name: 'James Doe', email: 'james@example.com' }
  const mockCallback = jest.fn()
  const { getByRole } = render(
    <User user={user} onDelete={mockCallback} />)

  userEvent.click(getByRole('button', { name: 'Delete' }))
  await waitFor(() => getByRole('button', { name: 'Confirm' }))
  userEvent.click(getByRole('button', { name: 'Confirm' }))

  await waitForExpect(() => {
    expect(mockCallback).toHaveBeenCalledWith(27)
  }, 700)
})
