export const EditUser = async (id, name, email) => {
  return new Promise(resolve => resolve({ id: id, name: name, email: email }))
}

export const DeleteUser = async (id) => {
  return new Promise(resolve => resolve())
}
