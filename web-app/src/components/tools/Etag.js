import sha256 from 'crypto-js/sha256'
import Base64 from 'crypto-js/enc-base64'

export const Etag = (id, name, email) => {
  return Base64.stringify(sha256(JSON.stringify({
    // Order is important
    email: email,
    id: id,
    name: name
  })))
}
