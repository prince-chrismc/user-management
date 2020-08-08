
export const MockApi = () => {
    const jsonServer = require('json-server')
    const server = jsonServer.create()
    const router = jsonServer.router({
        "users": [
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
    })
    const middlewares = jsonServer.defaults()

    // server.use(middlewares)
    server.use('/um/v1', router)
    server.listen(3000, () => {
        console.log('JSON Server is running')
    })

    return server
}
