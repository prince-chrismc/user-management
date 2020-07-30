import React from "react";
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

// import API mocking utilities from Mock Service Worker
// import { rest } from 'msw'
// import { setupServer } from 'msw/node'

import waitForExpect from 'wait-for-expect'

jest.mock('../src/components/endpoints/User');

import User from '../src/components/cards/Display'
import ModifyUser from '../src/components/user/Edit'

test("renders", () => {
   render(<User id="0" name="Jenny Doe" email="jenny@example.com" />);

   fireEvent.click(screen.getByText('Edit'))
   waitFor(() => screen.getByRole('button', { name: 'Save' }))

   expect(screen.getAllByRole('textbox')[0]).toHaveValue('Jenny Doe')
   expect(screen.getAllByRole('textbox')[1]).toHaveValue('jenny@example.com')
   expect(screen.getByRole('button', { name: 'Save' })).toHaveTextContent('Save')
});

// const server = setupServer(
//    rest.patch(process.env.API_URL + '/um/v1/users/:id', (req, res, ctx) => { // capture "GET /greeting" requests
//       console.log(req.body)
//       return res(ctx.json({ greeting: 'hello there' })) // respond using a mocked JSON body
//    }),
//    rest.patch('/um/v1/users/:id', (req, res, ctx) => { // capture "GET /greeting" requests
//       console.log(req.body)
//       return res(ctx.json({ greeting: 'hello there' })) // respond using a mocked JSON body
//    })
// )

// // establish API mocking before all tests
// beforeAll(() => server.listen())
// // reset any request handlers that are declared as a part of our tests
// // (i.e. for testing one-time error scenarios)
// afterEach(() => server.resetHandlers())
// // clean up once the tests are done
// afterAll(() => server.close())

test("default data on submit", () => {
   const mockCallback = jest.fn((name, email) => { console.log(name, " ", email) })
   const { getByText, getByRole } = render(<ModifyUser id="0" name="Jenny Doe" email="jenny@example.com"
      onChange={mockCallback} />)

   fireEvent.click(screen.getByText('Edit'))
   waitFor(() => getByRole('button', { name: 'Save' }))
   fireEvent.click(getByRole('button', { name: 'Save' }))

   waitForExpect(() => {
      expect(mockCallback.mock.calls.length).toBe(1)
      expect(mockCallback.mock.calls[0][0]).toBe("Jenny Doe");
      expect(mockCallback.mock.calls[0][0]).toBe("jenny@example.com");
   })
});
