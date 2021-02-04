import { render, waitFor, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/extend-expect'
import waitForExpect from 'wait-for-expect'

import CreateUser from './Add'

jest.mock('../endpoints/List')

test('renders', () => {
  render(<CreateUser onAdd={(id, name, email) => { expect(true).toBe(false) }} />)

  userEvent.click(screen.getByRole('button', { name: 'Add' }))
  waitFor(() => screen.getByRole('button', { name: 'Save' }))

  expect(screen.getByPlaceholderText('Name')).toHaveValue('John Doe')
  expect(screen.getByPlaceholderText('Email')).toHaveValue('john@example.com')
  expect(screen.getByRole('button', { name: 'Save' })).toHaveTextContent('Save')

  userEvent.type(screen.getByPlaceholderText('Name'), '{esc}')

  expect(screen.queryByPlaceholderText('Name')).not.toBeInTheDocument()
  expect(screen.queryByPlaceholderText('Email')).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument()
  expect(screen.queryByText('Success!', { exact: false })).not.toBeInTheDocument()
})

test('default data on submit', async () => {
  const mockCallback = jest.fn((id, name, email) => { })
  const { getByRole } = render(<CreateUser onAdd={mockCallback} />)

  userEvent.click(getByRole('button', { name: 'Add' }))
  waitFor(() => getByRole('button', { name: 'Save' }))
  userEvent.click(getByRole('button', { name: 'Save' }))
  expect(mockCallback).not.toHaveBeenCalled()

  await waitForExpect(() => {
    expect(mockCallback).toHaveBeenCalledWith({ id: 9, name: 'John Doe', email: 'john@example.com' })
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
    expect(screen.getByText('Success!', { exact: false })).toBeInTheDocument()
  }, 700)
})

test('new data on submit', async () => {
  const mockCallback = jest.fn((id, name, email) => { })
  const { getByPlaceholderText, getByRole, getByText } = render(<CreateUser onAdd={mockCallback} />)

  userEvent.click(screen.getByText('Add'))
  waitFor(() => getByRole('button', { name: 'Save' }))

  fireEvent.change(getByPlaceholderText('Name'), { target: { value: 'Jenny Doe' } })
  fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'jenny@example.com' } })
  userEvent.click(getByRole('button', { name: 'Save' }))
  expect(mockCallback).not.toHaveBeenCalled()

  await waitForExpect(() => {
    expect(mockCallback).toHaveBeenCalledWith({ id: 9, name: 'Jenny Doe', email: 'jenny@example.com' })
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
    expect(screen.getByText('Success!', { exact: false })).toBeInTheDocument()
  }, 700)
})
