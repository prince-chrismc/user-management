import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import waitForExpect from 'wait-for-expect'
import userEvent from '@testing-library/user-event'

import ModifyUser from '../src/components/user/Edit' // to override API calls to backend

jest.mock('../src/components/endpoints/User')

test('renders', () => {
  render(<ModifyUser id="0" name="Jenny Doe" email="jenny@example.com"
    onChange={(name, email) => { expect(true).toBe(false) }} />)

  fireEvent.click(screen.getByText('Edit'))
  waitFor(() => screen.getByRole('button', { name: 'Save' }))

  expect(screen.getByPlaceholderText('Name')).toHaveValue('Jenny Doe')
  expect(screen.getByPlaceholderText('Email')).toHaveValue('jenny@example.com')
  expect(screen.getByRole('button', { name: 'Save' })).toHaveTextContent('Save')

  userEvent.type(screen.getByPlaceholderText('Name'), '{esc}')

  expect(screen.queryByPlaceholderText('Name')).not.toBeInTheDocument()
  expect(screen.queryByPlaceholderText('Email')).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument()
})

test('default data on submit', () => {
  const mockCallback = jest.fn((name, email) => { })
  const { getByText, getByRole } = render(<ModifyUser id="0" name="Jenny Doe" email="jenny@example.com"
    onChange={mockCallback} />)

  fireEvent.click(screen.getByText('Edit'))
  waitFor(() => getByRole('button', { name: 'Save' }))
  fireEvent.click(getByRole('button', { name: 'Save' }))

  waitForExpect(() => {
    expect(mockCallback.mock.calls.length).toBe(1)
    expect(mockCallback.mock.calls[0][0]).toBe('Jenny Doe')
    expect(mockCallback.mock.calls[0][0]).toBe('jenny@example.com')
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
  })
})

test('new data on submit', () => {
  const mockCallback = jest.fn((name, email) => { })
  const { getByPlaceholderText, getByRole } = render(<ModifyUser id="0" name="Jenny Doe" email="jenny@example.com"
    onChange={mockCallback} />)

  fireEvent.click(screen.getByText('Edit'))
  waitFor(() => getByRole('button', { name: 'Save' }))

  fireEvent.change(getByPlaceholderText('Name'), { target: { value: 'John Doe' } })
  fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'john@example.com' } })

  fireEvent.click(getByRole('button', { name: 'Save' }))

  waitForExpect(() => {
    expect(mockCallback.mock.calls.length).toBe(1)
    expect(mockCallback.mock.calls[0][0]).toBe('John Doe')
    expect(mockCallback.mock.calls[0][0]).toBe('john@example.com')
  })
})
