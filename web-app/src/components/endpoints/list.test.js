import React from 'react'
import { enableFetchMocks } from 'jest-fetch-mock'

import { LoadUsers } from './List'

const http = require('http')
const express = require('express')
let app = express()
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

let server = null

beforeEach(async () => {
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    })
    server = http.createServer(app)

    await new Promise(resolve => setTimeout(resolve, 2000))
})

afterEach(async () => {
    server.close(() => {
        console.log('HTTP server closed')
    })

    server = null
    app = null
    await new Promise(resolve => setTimeout(resolve, 2000))
})

test('get list of users', async () => {
    // enableFetchMocks()

    const json = await LoadUsers()
    console.log(json)

    expect(json).toEqual(JSON_USER_LIST)
})