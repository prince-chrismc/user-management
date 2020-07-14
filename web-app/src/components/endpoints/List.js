export const LoadUsers = async () =>
  await fetch('https://localhost:8080/um/v1/users')
    .then(res => (res.ok ? res : Promise.reject(res)))
    .then(res => res.json());

export const AddUser = async (name, email) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name, email: email })
  };
  return await fetch('https://localhost:8080/um/v1/users', requestOptions)
    .then(res => (res.ok ? res : Promise.reject(res)))
    .then(res => res.json());
};
