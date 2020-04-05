import React, { Component } from 'react'
import { Button, Modal, Form } from 'semantic-ui-react'

class FormEditNameAndEmail extends Component {
  state = { name: this.props.name, email: this.props.email }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  render() {
    const { name, email } = this.state

    return (
      <Form onSubmit={()=>{this.props.handleSubmit(this.state.name, this.state.email)}}>
        <Form.Group>
          <Form.Input
            placeholder='Name'
            name='name'
            value={name}
            onChange={this.handleChange}
          />
          <Form.Input
            placeholder='Email'
            name='email'
            value={email}
            onChange={this.handleChange}
          />
          <Form.Button content='Submit' />
        </Form.Group>
      </Form>
    )
  }
}


const ModalModalExample = (props) => (
  <Modal trigger={<Button>Edit</Button>}>
    <Modal.Header>Edit Settings</Modal.Header>
    <Modal.Content>
      <Modal.Description>
        <FormEditNameAndEmail
          name={props.name}
          email={props.email}
          handleSubmit={props.handler}
        />
      </Modal.Description>
    </Modal.Content>
  </Modal>
)

export default ModalModalExample
