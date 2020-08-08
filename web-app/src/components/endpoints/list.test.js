import React from 'react'
import { enableFetchMocks } from 'jest-fetch-mock' // mock fetch within list endpoints

import { LoadUsers } from './List'


const express = require('express')
const { createHttpTerminator } = require('http-terminator')
const app = express()
const port = 3001

const JSON_USER_LIST = [
    {
        "id": 123,
        "name": "John Doe",
        "email": "john@example.com"
    },
    {
        "id": 256,
        "name": "Jane Doe",
        "email": "jane@example.com"
    }
]

app.get('/um/v1/users', (req, res) => {
    console.log('GET /um/v1/users')
    res.send(JSON.stringify(JSON_USER_LIST))
})

let httpTerminator = null

beforeEach(async () => {
    const server = app.listen(port, () => {
        console.log(`Mock listening at http://localhost:${port}`)
    })
    httpTerminator = createHttpTerminator({ server })

    await new Promise(resolve => setTimeout(resolve, 2000))
})

afterEach(async () => {
    httpTerminator.terminate()
    await new Promise(resolve => setTimeout(resolve, 2000))
})

test('get list of users', async () => {
    const json = await LoadUsers()
    console.log(json)

    expect(json).toEqual(JSON_USER_LIST)
})