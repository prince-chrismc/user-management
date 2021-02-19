import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import WarningMessage from './Warning'

test('renders an error message', () => {
  const { container } = render(<WarningMessage message="Watch your step!" />)
  expect(container.firstChild).toMatchInlineSnapshot(`
    <div
      class="ui icon warning message"
    >
      <i
        aria-hidden="true"
        class="warning sign icon"
      />
      <div
        class="content"
      >
        <div
          class="header"
        >
          The action you are about to perform is dangerous!
        </div>
        Watch your step!
      </div>
    </div>
  `)
})
