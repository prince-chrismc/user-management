export const EditUser = async ([id, name, email, etag], props, { signal }) => {
  return new Promise(resolve => resolve({ id: id, name: name, email: email }))
}

export const DeleteUser = async ([id, etag], props, { signal }) => {
  return new Promise(resolve => resolve(null))
}
