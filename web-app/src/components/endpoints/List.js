import regeneratorRuntime from 'regenerator-runtime' // required for async

export const LoadUsers = async () => {
  const requestOptions = {
    headers: {
      'Accept': 'application/json',
      'Connection': 'keep-alive',
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache'
    }
  }
  console.log(process.env.API_URL + '/um/v1/users')
  return await fetch(process.env.API_URL + '/um/v1/users', requestOptions)
    .then(res => res.text())
    .then(json => console.log(json))
  // .then(body => JSON.parse(body))
}

export const AddUser = async (name, email) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: name, email: email })
  }
  return await fetch(process.env.API_URL + '/um/v1/users', requestOptions)
    .then(res => (res.ok ? res : Promise.reject(res)))
    .then(res => JSON.parse(res.text()))
}
