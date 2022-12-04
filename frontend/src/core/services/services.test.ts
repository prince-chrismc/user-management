import 'cross-fetch/polyfill'

import { LoadUsers, AddUser } from './List'
import { EditUser, DeleteUser } from './User'
import { Etag } from '../tools/Etag'

import e, { json } from 'express'
import { createHttpTerminator } from 'http-terminator'
const app = e()
const port = 3001

let __error = false

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

app.use(json())

app.get('/um/v1/users', (req, res) => {
  console.log('GET /um/v1/users')

  if (__error) {
    res.sendStatus(500)
  } else {
    res.send(JSON.stringify(JSON_USER_LIST))
  }
})

app.put('/um/v1/users', (req, res) => {
  console.log('POST /um/v1/users', req.body)

  if (__error) {
    res.sendStatus(500)
  } else {
    const json = req.body
    json.id = 543
    res.send(JSON.stringify(json))
  }
})

app.delete('/um/v1/users/:id(\\d+)', (req, res) => {
  console.log('DELETE /um/v1/users/', req.params.id)

  if (__error) {
    res.sendStatus(500)
  } else if (typeof req.header('If-Match') === 'undefined') {
    res.sendStatus(428)
  } else {
    res.sendStatus(204)
  }
})

app.patch('/um/v1/users/:id(\\d+)', (req, res) => {
  console.log('PATCH /um/v1/users/', req.params.id, req.body)

  if (__error) {
    res.sendStatus(500)
  } else if (typeof req.header('If-Match') === 'undefined') {
    res.sendStatus(428)
  } else {
    const json = req.body
    json.id = req.params.id
    res.status(202).send(JSON.stringify(json))
  }
})

let httpTerminator = null

beforeEach(async () => {
  __error = false
  const server = app.listen(port, () => {
    console.log(`Mock listening at http://localhost:${port}`)
  })
  httpTerminator = createHttpTerminator({ server })

  await new Promise(resolve => setTimeout(resolve, 1000))
})

afterEach(async () => {
  httpTerminator.terminate()
  await new Promise(resolve => setTimeout(resolve, 1000))
})

test('get list of users', async () => {
  const json = await LoadUsers()
  console.log(json)

  expect(json).toEqual(JSON_USER_LIST)
})

test('add new user to list', async () => {
  const json = await AddUser(['James Does', 'james@example.com'], null, { signal: null })
  console.log(json)

  expect(json).toEqual({ id: 543, name: 'James Does', email: 'james@example.com' })
})

test('faulty backend > get list', async () => {
  __error = true
  expect.assertions(1)

  await expect(LoadUsers()).rejects.toBeInstanceOf(Response)
})

test('faulty backend > add user', async () => {
  __error = true
  expect.assertions(1)

  await expect(AddUser(['James Does', 'james@example.com'], null, { signal: null })).rejects.toBeInstanceOf(Response)
})

test('delete users', async () => {
  const etag = Etag(JSON_USER_123.id, JSON_USER_123.name, JSON_USER_123.email)
  const json = await DeleteUser([123, etag], null, { signal: null })
  console.log(json)

  expect(json).toBeNull()
})

test('edit users', async () => {
  const etag = Etag(JSON_USER_123.id, JSON_USER_123.name, JSON_USER_123.email)
  const json = await EditUser([123, 'James Does', 'james@example.com', etag], null, { signal: null })
  console.log(json)

  expect(json).toEqual({ email: 'james@example.com', id: '123', name: 'James Does' })
})

test('faulty backend > delete user', async () => {
  __error = true
  expect.assertions(1)

  await expect(DeleteUser([123, 'etag'], null, { signal: null })).rejects.toBeInstanceOf(Response)
})

test('faulty backend > edit user', async () => {
  __error = true
  expect.assertions(1)

  await expect(EditUser([123, 'James Does', 'james@example.com', 'etag'], null, { signal: null })).rejects.toBeInstanceOf(Response)
})
