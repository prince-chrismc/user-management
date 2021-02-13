import { render, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import waitForExpect from 'wait-for-expect'
import userEvent from '@testing-library/user-event'

import AddCard from './Add'

jest.mock('../../core/services/List')

test('renders', () => {
  const { getByText, getByRole } = render(<AddCard onAdd={() => {}} />)
  expect(getByText('Create New User')).toBeInTheDocument()
  expect(getByText('Someone New', { exact: false })).toBeInTheDocument()
  expect(getByRole('button', { name: 'Add' })).toHaveTextContent('Add')
})

test('updates on add', async () => {
  const mockCallback = jest.fn((name, email) => { })
  const { container, getByPlaceholderText, getByRole, getByText } = render(
    <AddCard onAdd={mockCallback} />)

  userEvent.click(getByRole('button', { name: 'Add' }))
  waitFor(() => getByRole('button', { name: 'Save' })) // Wait for module to pop up

  fireEvent.change(getByPlaceholderText('Name'), { target: { value: 'Jane Doe' } })
  fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'jane@example.com' } })
  userEvent.click(getByRole('button', { name: 'Save' }))

  await waitForExpect(() => {
    expect(mockCallback).toHaveBeenCalledWith({ email: 'jane@example.com', id: 9, name: 'Jane Doe' })
    expect(getByRole('button', { name: 'Save' })).toBeDisabled()
    expect(getByText('Success!', { exact: false })).toBeInTheDocument()
  }, 700)

  expect(container.querySelector('i')).toBeInTheDocument()
  userEvent.click(container.querySelector('i'))
})
