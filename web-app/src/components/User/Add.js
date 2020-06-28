import React, { Component } from 'react';
import { Card, Button, Modal } from 'semantic-ui-react'

import FormEditNameAndEmail from './Edit'

class AddUser extends Component {
  handleSubmit = (name, email) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, email: email })
    };
    fetch('https://localhost:8080/um/v1/users', requestOptions)
  }

  render() {
    return (
      <Card>
        <Card.Content>
          <Modal trigger={<Button content='Add' icon='user outline' labelPosition='left' color='green'/>} closeIcon>
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
