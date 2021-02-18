import { render, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import waitForExpect from 'wait-for-expect'
import userEvent from '@testing-library/user-event'

import MakeCards from './Individuals'

jest.mock('../../core/services/List')
jest.mock('../../core/services/User')

test('renders', () => {
  const { container } = render(
    <MakeCards
      users={[{ id: 99, name: 'Jamie Doe', email: 'jamie@example.com' }]}
    />
  )
  expect(container.firstChild).toMatchInlineSnapshot(`
    <div
      class="ui cards"
    >
      <div
        class="ui grey card"
      >
        <div
          class="content"
        >
          <div
            class="header"
          >
            Jamie Doe
          </div>
          <div
            class="meta"
          >
            jamie@example.com
          </div>
        </div>
        <div
          class="extra content"
        >
          <div
            class="ui two buttons"
          >
            <button
              class="ui icon left floated left labeled button"
            >
              <i
                aria-hidden="true"
                class="edit outline icon"
              />
              Edit
            </button>
            <div
              class="or"
            />
            <button
              class="ui red icon right floated right labeled button"
            >
              <i
                aria-hidden="true"
                class="user cancel icon"
              />
              Delete
            </button>
          </div>
        </div>
      </div>
      <div
        class="ui green card"
      >
        <div
          class="content"
        >
          <div
            class="header"
          >
            Create New User
          </div>
          <div
            class="meta"
          >
            Someone new in the organization? Click below to add them to the database!
          </div>
        </div>
        <div
          class="extra content"
        >
          <div
            class="ui two buttons"
          >
            <button
              class="ui green icon left labeled button"
            >
              <i
                aria-hidden="true"
                class="user outline icon"
              />
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  `)
})

test('updates on add', async () => {
  const { getByPlaceholderText, getByRole, getByText } = render(
    <MakeCards
      users={[]}
    />
  )

  userEvent.click(getByRole('button', { name: 'Add' }))
  await waitFor(() => getByRole('button', { name: 'Save' }))

  fireEvent.change(getByPlaceholderText('Name'), { target: { value: 'Jane Doe' } })
  fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'jane@example.com' } })
  userEvent.click(getByRole('button', { name: 'Save' }))

  await waitForExpect(() => {
    expect(getByRole('button', { name: 'Save' })).toBeDisabled()
    expect(getByText('Success!', { exact: false })).toBeInTheDocument()
  }, 700)

  expect(getByText('Jane Doe')).toBeInTheDocument()
  expect(getByText('jane@example.com')).toBeInTheDocument()
})

test('updates on edit', async () => {
  const { getByPlaceholderText, getByRole, getByText, queryByText } = render(
    <MakeCards
      users={[{ id: 99, name: 'Jenny Doe', email: 'jenny@example.com' }]}
    />
  )

  expect(getByText('Jenny Doe')).toBeInTheDocument()
  expect(getByText('jenny@example.com')).toBeInTheDocument()

  userEvent.click(getByRole('button', { name: 'Edit' }))
  await waitFor(() => getByRole('button', { name: 'Save' }))

  fireEvent.change(getByPlaceholderText('Name'), { target: { value: 'John Doe' } })
  fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'john@example.com' } })
  userEvent.click(getByRole('button', { name: 'Save' }))

  await waitForExpect(() => {
    expect(getByRole('button', { name: 'Save' })).toBeDisabled()
    expect(getByText('Success!', { exact: false })).toBeInTheDocument()
  }, 700)

  expect(getByText('John Doe')).toBeInTheDocument()
  expect(getByText('john@example.com')).toBeInTheDocument()
  expect(queryByText('Jenny Doe')).not.toBeInTheDocument()
  expect(queryByText('jenny@example.com')).not.toBeInTheDocument()
})

test('updates on delete', async () => {
  const { getByRole, getByText, queryByText } = render(
    <MakeCards
      users={[{ id: 99, name: 'Jenny Doe', email: 'jenny@example.com' }]}
    />
  )

  expect(getByText('Jenny Doe')).toBeInTheDocument()
  expect(getByText('jenny@example.com')).toBeInTheDocument()

  userEvent.click(getByText('Delete'))
  await waitFor(() => getByRole('button', { name: 'Confirm' }))
  userEvent.click(getByRole('button', { name: 'Confirm' }))

  await waitForExpect(() => {
    expect(getByRole('button', { name: 'Confirm' })).toBeDisabled()
    expect(getByText('Success!', { exact: false })).toBeInTheDocument()
  }, 700)

  await waitForExpect(() => {
    expect(queryByText('Jenny Doe')).not.toBeInTheDocument()
    expect(queryByText('jenny@example.com')).not.toBeInTheDocument()
  }, 1500)
})
