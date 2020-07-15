import React from 'react'
import { Form, Message } from 'semantic-ui-react'

const FormConfirm = ({ name, handleSubmit }) => (
  <Form warning onSubmit={() => { handleSubmit() }}>
    <Message
      warning
      icon='warning sign'
      header='The action you are about to perform is dangerous!'
      content={'You are about to delete "' + name + '". Are you sure about that?'}
    />
    <Form.Button color='red' icon='warning' content='Confirm' fluid inverted />
  </Form>
)

export default FormConfirm
