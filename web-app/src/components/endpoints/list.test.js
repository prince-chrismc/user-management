import React from 'react'
import { enableFetchMocks } from 'jest-fetch-mock' // mock fetch within list endpoints

import { LoadUsers, AddUser } from './List'

const express = require('express')
const { createHttpTerminator } = require('http-terminator')
const app = express()
const port = 3001

const JSON_USER_LIST = [
  {
    id: 123,
    name: 'John Doe',
    email: 'john@example.com'
  },
  {
    id: 256,
    name: 'Jane Doe',
    email: 'jane@example.com'
  }
]

app.use(express.json())

app.get('/um/v1/users', (req, res) => {
  console.log('GET /um/v1/users')
  res.send(JSON.stringify(JSON_USER_LIST))
})

app.post('/um/v1/users', (req, res) => {
  console.log('POST /um/v1/users', req.body)
  const json = req.body
  json.id = 543
  res.send(JSON.stringify(json))
})

let httpTerminator = null

beforeEach(async () => {
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
  const json = await AddUser('James Does', 'james@example.com')
  console.log(json)

  expect(json).toEqual({ id: 543, name: 'James Does', email: 'james@example.com' })
})
