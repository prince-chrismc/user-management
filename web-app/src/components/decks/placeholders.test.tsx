/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/react'

import { Placeholders } from './Placeholders'

test('renders a placeholder', () => {
  const { container } = render(<Placeholders />)
  expect(container.firstChild).toMatchInlineSnapshot(`
    <div
      class="ui cards"
    >
      <div
        class="ui orange card"
      >
        <div
          class="content"
        >
          <div
            class="ui placeholder"
          >
            <div
              class="image header"
            >
              <div
                class="line"
              />
              <div
                class="line"
              />
            </div>
            <div
              class="paragraph"
            >
              <div
                class="line medium"
              />
              <div
                class="line short"
              />
            </div>
          </div>
        </div>
        <div
          class="extra content"
        >
          <button
            class="ui icon disabled left floated left labeled button"
            disabled=""
            tabindex="-1"
          >
            <i
              aria-hidden="true"
              class="edit outline icon"
            />
            Edit
          </button>
          <button
            class="ui red icon disabled right floated right labeled button"
            disabled=""
            tabindex="-1"
          >
            <i
              aria-hidden="true"
              class="user cancel icon"
            />
            Delete
          </button>
        </div>
      </div>
      <div
        class="ui orange card"
      >
        <div
          class="content"
        >
          <div
            class="ui placeholder"
          >
            <div
              class="image header"
            >
              <div
                class="line"
              />
              <div
                class="line"
              />
            </div>
            <div
              class="paragraph"
            >
              <div
                class="line medium"
              />
              <div
                class="line short"
              />
            </div>
          </div>
        </div>
        <div
          class="extra content"
        >
          <button
            class="ui icon disabled left floated left labeled button"
            disabled=""
            tabindex="-1"
          >
            <i
              aria-hidden="true"
              class="edit outline icon"
            />
            Edit
          </button>
          <button
            class="ui red icon disabled right floated right labeled button"
            disabled=""
            tabindex="-1"
          >
            <i
              aria-hidden="true"
              class="user cancel icon"
            />
            Delete
          </button>
        </div>
      </div>
      <div
        class="ui orange card"
      >
        <div
          class="content"
        >
          <div
            class="ui placeholder"
          >
            <div
              class="image header"
            >
              <div
                class="line"
              />
              <div
                class="line"
              />
            </div>
            <div
              class="paragraph"
            >
              <div
                class="line medium"
              />
              <div
                class="line short"
              />
            </div>
          </div>
        </div>
        <div
          class="extra content"
        >
          <button
            class="ui icon disabled left floated left labeled button"
            disabled=""
            tabindex="-1"
          >
            <i
              aria-hidden="true"
              class="edit outline icon"
            />
            Edit
          </button>
          <button
            class="ui red icon disabled right floated right labeled button"
            disabled=""
            tabindex="-1"
          >
            <i
              aria-hidden="true"
              class="user cancel icon"
            />
            Delete
          </button>
        </div>
      </div>
      <div
        class="ui orange card"
      >
        <div
          class="content"
        >
          <div
            class="ui placeholder"
          >
            <div
              class="image header"
            >
              <div
                class="line"
              />
              <div
                class="line"
              />
            </div>
            <div
              class="paragraph"
            >
              <div
                class="line medium"
              />
              <div
                class="line short"
              />
            </div>
          </div>
        </div>
        <div
          class="extra content"
        >
          <button
            class="ui icon disabled left floated left labeled button"
            disabled=""
            tabindex="-1"
          >
            <i
              aria-hidden="true"
              class="edit outline icon"
            />
            Edit
          </button>
          <button
            class="ui red icon disabled right floated right labeled button"
            disabled=""
            tabindex="-1"
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
  `)
})
