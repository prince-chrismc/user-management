import regeneratorRuntime from 'regenerator-runtime' // required for async


export const LoadUsers = async () => {
  return new Promise((resolve, reject) => resolve([
    { id: 123, name: "John Doe", email: "john@example.com" },
    { id: 256, name: "Jane Doe", email: "jane@example.com" }
  ]))
};

export const AddUser = async (name, email) => {
  return new Promise((resolve, reject) => resolve({ id: 9, name: name, email: email }))
};