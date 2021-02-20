export const LoadUsers = async () => {
  return new Promise(resolve => resolve([
    { id: 123, name: 'John Doe', email: 'john@example.com' },
    { id: 256, name: 'Jane Doe', email: 'jane@example.com' }
  ]))
}

export const AddUser = async ([name, email], props, { signal }) => {
  return new Promise(resolve => resolve({ id: 9, name: name, email: email }))
}
