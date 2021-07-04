/**
 * @jest-environment jsdom
 */

 import { render } from '@testing-library/react'

import PendingMessage from './Pending'

test('renders a pending message', () => {
  const { container } = render(<PendingMessage message='Hello World' />)
  expect(container.firstChild).toMatchInlineSnapshot(`
    <div
      class="ui icon message"
    >
      <i
        aria-hidden="true"
        class="circle notched loading icon"
      />
      <div
        class="content"
      >
        <div
          class="header"
        >
          Just one second
        </div>
        Hello World
      </div>
    </div>
  `)
})
