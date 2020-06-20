import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';

import EditModal from './EditModal'

class User extends Component {
  state = { name: this.props.name, email: this.props.email }

  handleSubmit = (name, email) => {
    this.setState({ name: name, email: email })
  }

  render() {
    const { name, email } = this.state
    return (
      <Card>
        <Card.Content>
        <Card.Header>
          {name}
        </Card.Header>
        <Card.Meta>
          {email}
        </Card.Meta>
        </Card.Content>
      <Card.Content extra>
          <EditModal
            name={this.state.name}
            email={this.state.email}
            handler={this.handleSubmit} />
        </Card.Content>
      </Card>
    )
  }
}

export default User;
