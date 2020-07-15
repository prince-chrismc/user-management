
import React, { Component } from 'react'
import { Card, Button } from 'semantic-ui-react'

import CreateUser from '../user/Add'

class AddCard extends Component {
  render() {
    return (
      <Card color='green'>
        <Card.Content>
          <Card.Header>Create New User</Card.Header>
          <Card.Meta>Someone new in the organization? Click below to add them to the database!</Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <Button.Group widths='2'>
            <CreateUser />
          </Button.Group>
        </Card.Content>
      </Card >
    )
  }
}

export default AddCard
