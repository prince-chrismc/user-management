import regeneratorRuntime from 'regenerator-runtime' // required for async

export const LoadUsers = async () =>
  new Promise((resolve, reject) => {
    resolve(JSON.stringify([{ id: 123, name: "John Doe", email: "john@example.com" },
    { id: 256, name: "Jane Doe", email: "jane@example.com" }]))
  });

export const AddUser = async (name, email) =>
  new Promise((resolve, reject) => {
    resolve(JSON.stringify({ id: 9, name: name, email: email }))
  });
