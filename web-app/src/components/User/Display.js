import React, { Component } from 'react';
import { Message, Card, Button } from 'semantic-ui-react'

import FormEditNameAndEmail from './Edit'
import OptionalMessage from '../dialogs/OptionalMessage'
import PopupModal from '../dialogs/UserModal'

class User extends Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
    this.state = { id: this.props.id, name: this.props.name, email: this.props.email, showError: false, errMsg: "", showOkay: false }
  }

  toggleError = (err) => {
    this.setState((prevState) => {
      return { showError: !prevState.showError, errMsg: err }
    })
  };

  toggleSuccess = (name, email) => {
    this.setState((prevState) => {
      return { showOkay: !prevState.showOkay }
    })
    this.setState({ name: name, email: email })
    console.log("toggleSuccess")
  };

  handleSubmit = (name, email) => {
    const requestOptions = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, email: email })
    };

    fetch('https://localhost:8080/um/v1/users/' + this.state.id, requestOptions)
      .then(res => (res.ok ? res : Promise.reject(res)))
      .then(res => res.json())
      .then(data => this.toggleSuccess(data.name, data.email))
      .then(console.log("done"))
      .catch((err) => this.toggleError(err))
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
          <PopupModal content='Edit' icon='edit outline' labelPosition='left' floated='left'
            header='Edit Settings' ref={this.child}>
            <OptionalMessage isVisible={this.state.showError}>
              <Message negative
                header='Oh no! Something went horribly wrong'
                content={this.state.errMsg}
              />
            </OptionalMessage>
            <OptionalMessage isVisible={this.state.showOkay}>
              <Message positive
                header='Success! The operation completed without anny issue'
                content='The user was successfully modified'
              />
            </OptionalMessage>
            <FormEditNameAndEmail
              name={this.state.name}
              email={this.state.email}
              handleSubmit={this.handleSubmit}
            />
          </PopupModal>
          <Button color='red' content='Delete' icon='user cancel' labelPosition='right' floated='right' onClick={this.handleDelete} />
        </Card.Content>
      </Card>
    )
  }
}

export default User;
