import React, { Component } from 'react';
import { Card, Button, Modal } from 'semantic-ui-react'

import FormEditNameAndEmail from './Edit'

class AddUser extends Component {
  state = { open: false }
  open = () => this.setState({ open: true })
  close = () => this.setState({ open: false })

  handleSubmit = (name, email) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, email: email })
    };
    fetch('https://localhost:8080/um/v1/users', requestOptions)
      .then(res => (res.ok ? res : Promise.reject(res)))
      .then(this.close())
  }

  render() {
    const { open } = this.state

    return (
      <Card color='green'>
        <Card.Content>
          <Card.Header>Create New User</Card.Header>
          <Card.Meta>Someone new in the organization? Click below to add them to the database!</Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <Button content='Add' icon='user outline' labelPosition='left' color='green' onClick={this.open} />
          <Modal
            open={open}
            onClose={this.close}
            closeIcon>
            <Modal.Header>Add New User</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <FormEditNameAndEmail
                  name="John Doe"
                  email="john@example.com"
                  handleSubmit={this.handleSubmit}
                />
              </Modal.Description>
            </Modal.Content>
          </Modal>
        </Card.Content>
      </Card>
    )
  }
}

export default AddUser;
