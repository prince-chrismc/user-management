import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import SuccessMessage from './Success'

test('renders a success message', () => {
  const { container } = render(<SuccessMessage message="Hello World" />)
  expect(container.firstChild).toMatchInlineSnapshot(`
    <div
      class="ui icon success message"
    >
      <i
        aria-hidden="true"
        class="check icon"
      />
      <div
        class="content"
      >
        <div
          class="header"
        >
          Success! The operation was completed without any issue
        </div>
        Hello World
      </div>
    </div>
  `)
})
