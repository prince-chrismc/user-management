import React from 'react'
import { render, waitFor, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/extend-expect'
import waitForExpect from 'wait-for-expect'

import CreateUser from '../src/components/user/Add'

jest.mock('../src/components/endpoints/List')

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
})

test('default data on submit', () => {
  const mockCallback = jest.fn((id, name, email) => { })
  const { getByRole } = render(<CreateUser onAdd={mockCallback} />)

  userEvent.click(getByRole('button', { name: 'Add' }))
  waitFor(() => getByRole('button', { name: 'Save' }))

  waitForExpect(() => {
    expect(mockCallback.mock.calls.length).toBe(1)
  })
  waitForExpect(() => {
    expect(mockCallback.mock.calls[0][0]).toBe(9)
  })
  waitForExpect(() => {
    expect(mockCallback.mock.calls[0][1]).toBe('John Doe')
  })
  waitForExpect(() => {
    expect(mockCallback.mock.calls[0][2]).toBe('john@example.com')
  })
  waitForExpect(() => {
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
  })
})

test('new data on submit', () => {
  const mockCallback = jest.fn((id, name, email) => { })
  const { getByPlaceholderText, getByRole } = render(<CreateUser onAdd={mockCallback} />)

  userEvent.click(screen.getByText('Add'))
  waitFor(() => getByRole('button', { name: 'Save' }))

  fireEvent.change(getByPlaceholderText('Name'), { target: { value: 'Jenny Doe' } })
  fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'jenny@example.com' } })

  userEvent.click(getByRole('button', { name: 'Save' }))

  waitForExpect(() => {
    expect(mockCallback.mock.calls.length).toBe(1)
  })
  waitForExpect(() => {
    expect(mockCallback.mock.calls[0][0]).toBe(9)
  })
  waitForExpect(() => {
    expect(mockCallback.mock.calls[0][1]).toBe('Jenny Doe')
  })
  waitForExpect(() => {
    expect(mockCallback.mock.calls[0][2]).toBe('jenny@example.com')
  })
})
