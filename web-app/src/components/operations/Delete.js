import React, { Component } from 'react'
import { Message } from 'semantic-ui-react'

import FormConfirm from '../dialogs/ConfirmForm'
import PopupModal from '../dialogs/UserModal'
import { DeleteUser } from '../endpoints/User'
import { Etag } from '../tools/Etag'

class RemoveUser extends Component {
  state = { id: this.props.id, name: this.props.name, email: this.props.email, showError: false, errMsg: '', showOkay: false }

  toggleError = (err) => {
    this.setState((prevState) => {
      return { showError: !prevState.showError, errMsg: '' + err }
    })
  };

  toggleSuccess = () => {
    this.setState({ showOkay: true })
    this.props.onDelete()
  };

  clearMessages = () => {
    this.setState({ showError: false, showOkay: false })
  }

  handleDelete = () => {
    const etag = Etag(this.state.email, this.state.id, this.state.name)
    DeleteUser(this.state.id, etag)
      .then(() => this.toggleSuccess())
      .catch((err) => this.toggleError(err))
  }

  render () {
    return (
      <PopupModal color='red' content='Delete' icon='user cancel' labelPosition='right' floated='right'
        header='Delete User' onClose={this.clearMessages}>
        <FormConfirm name={this.state.name} handleSubmit={this.handleDelete}
          sucess={this.state.showError} error={this.state.showOkay}>
          <Message error
            header='Oh no! Something went horribly wrong'
            content={this.state.errMsg}
          />
          <Message success
            header='Success! The operation completed without any issue'
            content='The user was successfully modified'
          />
        </FormConfirm>
      </PopupModal>
    )
  }
}

export default RemoveUser
