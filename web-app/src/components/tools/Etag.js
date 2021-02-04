import { fromByteArray } from 'base64-js'
import { sha256 } from 'js-sha256'

export const Etag = (id, name, email) => {
  return fromByteArray(sha256.array(JSON.stringify({
    // Order is important
    email: email,
    id: id,
    name: name
  })))
}
