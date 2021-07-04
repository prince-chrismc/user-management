/**
 * @jest-environment jsdom
 */

 import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import PopupModal from './PopupModal'

test('renders a PopupModal', async () => {
  const mockCallback = jest.fn()
  const { container, getByTestId, getByText } = render(
    <PopupModal
      button={<button data-testid="button">Click Me!</button>}
      header="Title Here"
      onClose={mockCallback}
    >
      <p data-testid="children">Hello World</p>
    </PopupModal>
  )
  expect(container).toMatchInlineSnapshot(`
    <div>
      <button
        data-testid="button"
      >
        Click Me!
      </button>
    </div>
  `)

  userEvent.click(getByTestId('button'))
  await waitFor(() => getByTestId('children'))

  expect(getByTestId('children')).toHaveTextContent('Hello World')
  expect(getByText('Title Here')).toBeTruthy()
  expect(mockCallback).not.toHaveBeenCalled()
})
