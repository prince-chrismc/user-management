import { Etag } from './Etag'

test('generates valid etag', () => {
  expect(Etag(1, 'John Doe', 'john@example.com')).toEqual('UL0QnImh7QfyFgbE1Cpr/Zba5We96MVQeVfFc8OuecU=')
})
