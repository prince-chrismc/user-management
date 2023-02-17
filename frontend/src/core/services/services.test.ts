import 'cross-fetch/polyfill'

import { LoadUsers, AddUser } from './List'
import { EditUser, DeleteUser } from './User'
import { Etag } from '../tools/Etag'

import nock from 'nock'

const JSON_USER_123 = {
  id: 123,
  name: 'John Doe',
  email: 'john@example.com'
}
const JSON_USER_256 = {
  id: 256,
  name: 'Jane Doe',
  email: 'jane@example.com'
}
const JSON_USER_LIST = [
  JSON_USER_123,
  JSON_USER_256
]

// app.use(json())

// app.get('/um/v1/users', (req, res) => {
//   console.log('GET /um/v1/users')

//   if (__error) {
//     res.sendStatus(500)
//   } else {
//     res.send(JSON.stringify(JSON_USER_LIST))
//   }
// })

// app.put('/um/v1/users', (req, res) => {
//   console.log('POST /um/v1/users', req.body)

//   if (__error) {
//     res.sendStatus(500)
//   } else {
//     const json = req.body
//     json.id = 543
//     res.send(JSON.stringify(json))
//   }
// })

// app.delete('/um/v1/users/:id(\\d+)', (req, res) => {
//   console.log('DELETE /um/v1/users/', req.params.id)

//   if (__error) {
//     res.sendStatus(500)
//   } else if (typeof req.header('If-Match') === 'undefined') {
//     res.sendStatus(428)
//   } else {
//     res.sendStatus(204)
//   }
// })

// app.patch('/um/v1/users/:id(\\d+)', (req, res) => {
//   console.log('PATCH /um/v1/users/', req.params.id, req.body)

//   if (__error) {
//     res.sendStatus(500)
//   } else if (typeof req.header('If-Match') === 'undefined') {
//     res.sendStatus(428)
//   } else {
//     const json = req.body
//     json.id = req.params.id
//     res.status(202).send(JSON.stringify(json))
//   }
// })


test('get list of users', async () => {
  const scope = nock('http://localhost:3001', {})
    .get('/um/v1/users')
    .reply(200, JSON_USER_LIST)

  const json = await LoadUsers()

  expect(scope.isDone())
  expect(json).toEqual(JSON_USER_LIST)
})

test('add new user to list', async () => {
  const newUser = { id: 543, name: 'James Does', email: 'james@example.com' }
  const scope = nock('http://localhost:3001', {
    reqheaders: {
      'content-type': 'application/json'
    }
  })
    .put('/um/v1/users', JSON.stringify({ name: 'James Does', email: 'james@example.com' }))
    .reply(200, newUser)

  const json = await AddUser(['James Does', 'james@example.com'], null, { signal: null })

  expect(scope.isDone())
  expect(json).toEqual(newUser)
})

// These tests are simple enough jest assumes they could be ran in parrelel when added to a suite
// like `describe('faulty backend'` but nock does not lick this and the collide
test('faulty backend > get list', async () => {
  const scope = nock('http://localhost:3001', {
    reqheaders: {
      'content-type': 'application/json'
    }
  })
    .get('/um/v1/users')
    .reply(500)

  await expect(LoadUsers()).rejects.toBeTruthy()
  expect(scope.isDone())
})

test('faulty backend > add user', async () => {
  const scope = nock('http://localhost:3001', {
    reqheaders: {
      'accept': 'application/json'
    }
  })
    .put('/um/v1/users', JSON.stringify({ name: 'James Does', email: 'james@example.com' }))
    .reply(500)

  await expect(AddUser(['James Does', 'james@example.com'], null, { signal: null })).rejects.toBeTruthy() //.toBeInstanceOf(Response)
  expect(scope.isDone())
})

test('delete users', async () => {
  const etag = Etag(JSON_USER_123.id, JSON_USER_123.name, JSON_USER_123.email)
  const scope = nock('http://localhost:3001', {
    // reqheaders: {
    //   'if-match': etag
    // }
  })
    .delete('/um/v1/users/123')
    .reply(204)

  const json = await DeleteUser([123, etag], null, { signal: null })

  expect(scope.isDone())
  expect(json).toBeNull()
})

// test('edit users', async () => {
//   const etag = Etag(JSON_USER_123.id, JSON_USER_123.name, JSON_USER_123.email)
//   const json = await EditUser([123, 'James Does', 'james@example.com', etag], null, { signal: null })
//   console.log(json)

//   expect(json).toEqual({ email: 'james@example.com', id: '123', name: 'James Does' })
// })

// test('faulty backend > delete user', async () => {
//   __error = true
//   expect.assertions(1)

//   await expect(DeleteUser([123, 'etag'], null, { signal: null })).rejects.toBeInstanceOf(Response)
// })

// test('faulty backend > edit user', async () => {
//   __error = true
//   expect.assertions(1)

//   await expect(EditUser([123, 'James Does', 'james@example.com', 'etag'], null, { signal: null })).rejects.toBeInstanceOf(Response)
// })
