import React, { Component } from 'react';
import { Message, Card, Button, Modal } from 'semantic-ui-react'

import FormEditNameAndEmail from './Edit'
import OptionalMessage from '../dialogs/OptionalMessage'

class User extends Component {
  state = { id: this.props.id, name: this.props.name, email: this.props.email, showError: true, errMsg: "" }

  toggleError = () => {
    this.setState((prevState) => {
      return { showError: !prevState.showError, errMsg: 'Unknown error! Please contant our support team.' }
    })
  };

  handleSubmit = (name, email) => {
    this.toggleError()
    this.setState({ name: name, email: email })
    const requestOptions = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, email: email })
    };
    fetch('https://localhost:8080/um/v1/users/' + this.state.id, requestOptions)
      .then(res => (res.ok ? res : Promise.reject(res)))
  }

  handleDelete = () => {
    const requestOptions = {
      method: 'DELETE',
    };
    fetch('https://localhost:8080/um/v1/users/' + this.state.id, requestOptions)
      .then(res => (res.ok ? res : Promise.reject(res)))
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
                <OptionalMessage isVisible={this.state.showError}>
                  <Message negative
                    header='Oh no! Something went horribly wrong'
                    content={this.state.errMsg}
                  />
                </OptionalMessage>
                <FormEditNameAndEmail
                  name={this.state.name}
                  email={this.state.email}
                  handleSubmit={this.handleSubmit}
                />
              </Modal.Description>
            </Modal.Content>
          </Modal>
          <Button color='red' content='Delete' icon='user cancel' labelPosition='right' floated='right' onClick={this.handleDelete} />
        </Card.Content>
      </Card>
    )
  }
}

export default User;
