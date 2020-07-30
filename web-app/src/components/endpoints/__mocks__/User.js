import regeneratorRuntime from 'regenerator-runtime' // required for async

export const EditUser = async (id, name, email) => {
  console.log("mock_edit_user: ", process.env.API_URL)
  return new Promise((resolve, reject) => {
    resolve({id: id, name: name, email: email})
  });
}

export const DeleteUser = async (id) => {
  const requestOptions = {
    method: 'DELETE'
  }
  return await fetch(process.env.API_URL + '/um/v1/users/' + id, requestOptions)
    .then(res => (res.ok ? res : Promise.reject(res)))
}
