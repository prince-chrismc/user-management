import React, { Component } from 'react';
import { Message, Card, Button } from 'semantic-ui-react';

import FormEditNameAndEmail from './Edit';
import OptionalMessage from '../dialogs/OptionalMessage';
import PopupModal from '../dialogs/UserModal';
import { EditUser, DeleteUser } from '../endpoints/User';

class User extends Component {
  state = { id: this.props.id, name: this.props.name, email: this.props.email, showError: false, errMsg: '', showOkay: false }

  toggleError = (err) => {
    this.setState((prevState) => {
      return { showError: !prevState.showError, errMsg: [err] };
    });
  };

  toggleSuccess = (name, email) => {
    this.setState({ name: name, email: email, showOkay: true });
  };

  clearMessages = () => {
    this.setState({ showError: false, showOkay: false });
  }

  handleSubmit = (name, email) => {
    EditUser(this.state.id, name, email)
      .then((data) => { this.toggleSuccess(data.name, data.email); })
      .catch((err) => this.toggleError(err));
  }

  handleDelete = () => {
    DeleteUser(this.state.id)
      .then((data) => { this.toggleSuccess(data.name, data.email); })
      .catch((err) => this.toggleError(err));
  }

  render () {
    const { name, email } = this.state;
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
          <PopupModal content='Edit' icon='edit outline' labelPosition='left' floated='left'
            header='Edit Settings' onClose={this.clearMessages}>
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
              name={name}
              email={email}
              handleSubmit={this.handleSubmit}
            />
          </PopupModal>
          <Button color='red' content='Delete' icon='user cancel' labelPosition='right' floated='right' onClick={this.handleDelete} />
        </Card.Content>
      </Card>
    );
  }
}

export default User;
