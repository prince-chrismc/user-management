import { Component } from 'react'
import { Message } from 'semantic-ui-react'

import PopupModal from '../dialogs/UserModal'
import FormEditNameAndEmail from '../dialogs/EditForm'
import { AddUser } from '../endpoints/List'

class CreateUser extends Component {
  state = { showError: false, errMsg: '', showOkay: false }

  toggleError = (err) => {
    this.setState((prevState) => {
      return { showError: !prevState.showError, errMsg: '' + err }
    })
  };

  toggleSuccess = (id, name, email) => {
    this.setState({ showOkay: true })
    this.props.onAdd({ id, name, email })
  };

  handleSubmit = (name, email) => {
    AddUser(name, email)
      .then((data) => this.toggleSuccess(data.id, data.name, data.email))
      .catch((err) => this.toggleError(err))
  }

  clearMessages = () => {
    this.setState({ showError: false, showOkay: false })
  }

  render () {
    return (
      <PopupModal content='Add' icon='user outline' labelPosition='left' color='green'
        header='Add New User' onClose={this.clearMessages}>
        <FormEditNameAndEmail
          name="John Doe"
          email="john@example.com"
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

export default CreateUser
