import React, { Component } from 'react';
import { Card } from 'semantic-ui-react'

import PopupModal from '../dialogs/UserModal'
import FormEditNameAndEmail from './Edit'

class AddUser extends Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
  }

  handleSubmit = (name, email) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, email: email })
    };
    fetch('https://localhost:8080/um/v1/users', requestOptions)
      .then(res => (res.ok ? res : Promise.reject(res)))
      .then(this.child.current.close())
  }

  render() {
    return (
      <Card color='green'>
        <Card.Content>
          <Card.Header>Create New User</Card.Header>
          <Card.Meta>Someone new in the organization? Click below to add them to the database!</Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <PopupModal content='Add' icon='user outline' labelPosition='left' color='green'
            header='Add New User' ref={this.child}>
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

export default AddUser;
