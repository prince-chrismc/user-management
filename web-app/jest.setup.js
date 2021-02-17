window.React = require('react')
window.PropTypes = require('prop-types')

/**
 * This is just a little hack to silence a warning that we'll get until react fixes this
 * @see https://github.com/async-library/react-async/blob/4b6be365c5b007180636e28da2eae6b53768b431/jest.setup.js#L4
 * @see https://github.com/facebook/react/pull/14853
 */

const originalError = console.error

beforeAll(() => {
    console.error = (...args) => {
        if (/Warning.*not wrapped in act/.test(args[0])) {
            return
        }
        originalError.call(console, ...args)
    }
})

afterAll(() => {
    console.error = originalError
})
