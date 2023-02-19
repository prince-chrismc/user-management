export const EditUser = async ([id, name, email, etag], props, { signal }) => {
  const requestOptions = {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'If-Match': '"' + etag + '"' },
    body: JSON.stringify({ name: name, email: email })
  }
  return await fetch(process.env.API_URL + '/um/v1/users/' + id, requestOptions)
    .then(res => (res.ok ? res : Promise.reject(res)))
    .then(res => res.json())
}

export const FormatEtag = (etag) => '"' + etag + '"'

export const DeleteUser = async ([id, etag], props, { signal }) => {
  const requestOptions = {
    method: 'DELETE',
    headers: { 'If-Match': FormatEtag(etag) }
  }
  return await fetch(process.env.API_URL + '/um/v1/users/' + id, requestOptions)
    .then(res => (res.status === 204 ? null : Promise.reject(res)))
}
