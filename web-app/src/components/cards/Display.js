import { Component } from 'react'
import { Card, Button } from 'semantic-ui-react'

import ModifyUser from '../operations/Edit'
import RemoveUser from '../operations/Delete'

class User extends Component {
  state = { id: this.props.id, name: this.props.name, email: this.props.email }

  onChange = (name, email) => {
    this.setState({ name: name, email: email })
  };

  render () {
    const { id, name, email } = this.state
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
          <Button.Group widths='2'>
            <ModifyUser id={id} name={name} email={email} onChange={this.onChange} />
            <Button.Or />
            <RemoveUser id={id} name={name} email={email} onDelete={() => this.props.onDelete(id)} />
          </Button.Group>
        </Card.Content>
      </Card>
    )
  }
}

export default User
