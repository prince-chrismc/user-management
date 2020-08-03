import React, { Component } from 'react'
import { Message } from 'semantic-ui-react'

import FormEditNameAndEmail from '../dialogs/EditForm'
import PopupModal from '../dialogs/UserModal'
import { EditUser } from '../endpoints/User'

class ModifyUser extends Component {
  state = { id: this.props.id, name: this.props.name, email: this.props.email, showError: false, errMsg: '', showOkay: false }

  toggleError = (err) => {
    this.setState((prevState) => {
      return { showError: !prevState.showError, errMsg: '' + err }
    })
  };

  toggleSuccess = (name, email) => {
    this.setState({ name: name, email: email, showOkay: true })
    this.props.onChange(name, email)
  };

  clearMessages = () => {
    this.setState({ showError: false, showOkay: false })
  }

  handleSubmit = (name, email) => {
    EditUser(this.state.id, name, email)
      .then((data) => { this.toggleSuccess(data.name, data.email) })
      .catch((err) => this.toggleError(err))
  }

  render () {
    const { name, email } = this.state
    return (
      <PopupModal content='Edit' icon='edit outline' labelPosition='left' floated='left'
        header='Edit Settings' onClose={this.clearMessages}>
        <FormEditNameAndEmail
          name={name}
          email={email}
          handleSubmit={this.handleSubmit}
          error={this.state.showError}
          success={this.state.showOkay}
        >
          <Message error
            header='Oh no! Something went horribly wrong'
            content={this.state.errMsg}
          />
          <Message success
            header='Success! The operation completed without any issue'
            content='The user was successfully modified'
          />
        </FormEditNameAndEmail>
      </PopupModal>
    )
  }
}

export default ModifyUser
