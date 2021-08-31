/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/react'

import ErrorMessage from './Error'

test('renders an error message', () => {
  const { container } = render(<ErrorMessage message="Hello World" />)
  expect(container.firstChild).toMatchInlineSnapshot(`
    <div
      class="ui error icon message"
    >
      <i
        aria-hidden="true"
        class="cancel icon"
      />
      <div
        class="content"
      >
        <div
          class="header"
        >
          Oh no! Something went horribly wrong
        </div>
        <p>
          Error: 
          Hello World
        </p>
      </div>
    </div>
  `)
})
