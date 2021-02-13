import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import Layout from './Layout'

test('renders a layout', () => {
  Date.now = jest.fn(() => 1482363367071)
  const { container, getByTestId } = render(
    <Layout>
      <p data-testid="expected">Hello World</p>
    </Layout>
  )
  expect(getByTestId('expected')).toHaveTextContent('Hello World')
  expect(container.firstChild).toMatchInlineSnapshot(`
    <div
      class="ui container"
    >
      <h1
        class="ui header h1"
      >
        <div
          class="ui two column grid"
        >
          <div
            class="row"
          >
            <div
              class="column"
            >
              Users Management
            </div>
            <div
              class="column"
            >
              <span
                class="pullRight"
              >
                <time
                  datetime="1482363367071"
                >
                  23:36:07
                </time>
              </span>
            </div>
          </div>
        </div>
      </h1>
      <p
        data-testid="expected"
      >
        Hello World
      </p>
      <div
        class="ui divider"
      />
      <p
        class="pullRight"
      >
        Made with 
        <i
          aria-hidden="true"
          class="red heart icon"
        />
         by Chris Mc
      </p>
    </div>
  `)
})
