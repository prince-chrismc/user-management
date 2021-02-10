import { Form, Message } from 'semantic-ui-react'

const FormConfirm = ({ name, handleSubmit, children, success, error }) => (
  <Form onSubmit={handleSubmit}
    warning={!success && !error}
    success={success}
    error={error}
  >
    <Message
      warning={!success && !error}
      icon='warning sign'
      header='The action you are about to perform is dangerous!'
      content={'You are about to delete "' + name + '". Are you sure about that?'}
    />
    {children}
    <Form.Button color='red' icon='warning' content='Confirm' fluid inverted />
  </Form>
)

export default FormConfirm
