import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import SelectMessage from './Select'

const success = { message: 'It\'s working' }
const loading = { message: 'It\'s pending' }
const error = { message: 'It\'s failing' }

test('renders selects success', () => {
  const { container } = render(
    <SelectMessage success={success} loading={null} error={null} />
  )
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
        It's working
      </div>
    </div>
  `)
})

test('renders selects loading', () => {
  const { container } = render(
    <SelectMessage success={null} loading={loading} error={null} />
  )
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
        It's pending
      </div>
    </div>
  `)
})

test('renders selects error', () => {
  const { container } = render(
    <SelectMessage success={null} loading={null} error={error} />
  )
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
          It's failing
        </p>
      </div>
    </div>
  `)
})
