import regeneratorRuntime from 'regenerator-runtime' // required for async

export const EditUser = async (id, name, email) => {
  return new Promise((resolve, reject) => resolve({ id: id, name: name, email: email }));
}

export const DeleteUser = async (id) => {
  return new Promise((resolve, reject) => resolve());
}
