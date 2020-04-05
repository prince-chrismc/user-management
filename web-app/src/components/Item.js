import React, { Component }  from 'react';
import { Card } from 'semantic-ui-react';

import ModalModalExample from './Module'

class Item extends Component {
  state = { name: 'John Doe', email: 'john@example.com' }

  handleSubmit = (name, email) => {
    console.log("in parent " + name + " - " + email)
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
          <Card.Description>
            {email}
          </Card.Description>
          <Card.Description>
            <ModalModalExample
            name={this.state.name}
            email={this.state.email}
            handler={this.handleSubmit}/>
          </Card.Description>
        </Card.Content>
      </Card>
    )
  }
}

export default Item;
