import PropTypes from 'prop-types'
import useInput from '@rooks/use-input'
import { Form } from 'semantic-ui-react'

const UserForm = ({ user, handleSubmit, disabled }) => {
  const name = useInput(user.name)
  const email = useInput(user.email)

  return (
        <Form onSubmit={() => { handleSubmit(name.value, email.value) }}>
            <Form.Group>
                <Form.Input placeholder='Name' name='name' {...name} />
                <Form.Input placeholder='Email' name='email' {...email} />
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
