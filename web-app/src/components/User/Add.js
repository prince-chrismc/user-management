import React, { Component } from 'react'
import { Message, Card } from 'semantic-ui-react'

import PopupModal from '../dialogs/UserModal'
import OptionalMessage from '../dialogs/OptionalMessage'
import FormEditNameAndEmail from './Edit'
import { AddUser } from '../endpoints/List'

class AddCard extends Component {
  state = { showError: false, errMsg: '', showOkay: false }

  toggleError = (err) => {
    this.setState((prevState) => {
      return { showError: !prevState.showError, errMsg: [err] }
    })
  };

  toggleSuccess = () => {
    this.setState({ showOkay: true })
  };

  handleSubmit = (name, email) => {
    AddUser(name, email)
      .then(() => { this.toggleSuccess() })
      .catch((err) => this.toggleError(err))
  }

  clearMessages = () => {
    this.setState({ showError: false, showOkay: false })
  }

  render () {
    return (
      <Card color='green'>
        <Card.Content>
          <Card.Header>Create New User</Card.Header>
          <Card.Meta>Someone new in the organization? Click below to add them to the database!</Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <PopupModal content='Add' icon='user outline' labelPosition='left' color='green'
            header='Add New User' onClose={this.clearMessages}>
            <OptionalMessage isVisible={this.state.showError}>
              <Message negative
                header='Oh no! Something went horribly wrong'
                content={this.state.errMsg}
              />
            </OptionalMessage>
            <OptionalMessage isVisible={this.state.showOkay}>
              <Message positive
                header='Success! The operation completed without any issue'
                content='The user was successfully modified'
              />
            </OptionalMessage>
            <FormEditNameAndEmail
              name="John Doe"
              email="john@example.com"
              handleSubmit={this.handleSubmit}
            />
          </PopupModal>
        </Card.Content>
      </Card >
    )
  }
}

export default AddCard
