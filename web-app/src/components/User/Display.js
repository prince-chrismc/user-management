import React, { Component } from 'react';
import { Card, Button, Modal } from 'semantic-ui-react'

import FormEditNameAndEmail from './Edit'

class User extends Component {
  state = { name: this.props.name, email: this.props.email }

  handleSubmit = (name, email) => {
    this.setState({ name: name, email: email })
  }

  render() {
    const { name, email } = this.state
    return (
      <Card color='grey'>
        <Card.Content>
          <Card.Header>
            {name}
          </Card.Header>
          <Card.Meta>
            {email}
          </Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <Modal trigger={<Button content='Edit' icon='edit outline' labelPosition='left' floated='left' />} closeIcon>
            <Modal.Header>Edit Settings</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <FormEditNameAndEmail
                  name={this.state.name}
                  email={this.state.email}
                  handleSubmit={this.handleSubmit}
                />
              </Modal.Description>
            </Modal.Content>
          </Modal>
          <Button color='red' content='Delete' icon='user cancel' labelPosition='right' floated='right' />
        </Card.Content>
      </Card>
    )
  }
}

export default User;
