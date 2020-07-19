import React, { Component } from 'react'
import { Message } from 'semantic-ui-react'

import PopupModal from '../dialogs/UserModal'
import OptionalMessage from '../dialogs/OptionalMessage'
import FormEditNameAndEmail from '../dialogs/EditForm'
import { AddUser } from '../endpoints/List'

class CreateUser extends Component {
  state = { showError: false, errMsg: '', showOkay: false }

  toggleError = (err) => {
    this.setState((prevState) => {
      return { showError: !prevState.showError, errMsg: '' + err }
    })
  };

  toggleSuccess = () => {
    this.setState({ showOkay: true })
  };

  handleSubmit = (name, email) => {
    AddUser(name, email)
      .then((data) => { this.props.onAdd(data) })
      .then(() => { this.toggleSuccess() })
      .catch((err) => this.toggleError(err))
  }

  clearMessages = () => {
    this.setState({ showError: false, showOkay: false })
  }

  render () {
    return (
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
    )
  }
}

export default CreateUser
