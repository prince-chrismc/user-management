import React from 'react'
import { enableFetchMocks } from 'jest-fetch-mock'

import { MockApi } from './__test__/mock'

import { LoadUsers } from './List'

beforeEach(async () => {
    // const server = MockApi()
    await new Promise(resolve => setTimeout(resolve, 4000))
})

test('get list of users', async () => {
    console.log(process.env.API_URL + '/um/v1/users')
    enableFetchMocks()

    // await new Promise(resolve => setTimeout(resolve, 30000))

    expect(LoadUsers()).resolves.not.toBe(null)
})