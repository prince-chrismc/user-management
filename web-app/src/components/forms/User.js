import { useState } from 'react'
import { Form } from 'semantic-ui-react'
// import useInput from '@rooks/use-input'

const UserForm = ({ user, handleSubmit, disabled }) => {
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)

  return (
    <Form onSubmit={() => { handleSubmit(name.value, email.value) }}>
      <Form.Group>
        <Form.Input placeholder='Name' name='name' value={name} onChange={(e, { value }) => setName(value)} />
        <Form.Input placeholder='Email' name='email' value={name} onChange={(e, { value }) => setEmail(value)} />
        <Form.Button color='green' icon='check' content='Save' inverted disabled={disabled} />
      </Form.Group>
    </Form>
  )
}

UserForm.propTypes = {
  user: PropTypes.exact({
    id: PropTypes.number,
    name: PropTypes.string,
    email: PropTypes.string
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  disabled: PropTypes.bool
}

export default UserForm
