import { Component } from 'react'
import { Card } from 'semantic-ui-react'

import User from '../cards/Display'
import AddCard from '../cards/Add'

export class MakeCards extends Component {
    state = { users: this.props.users }
  
    onAdd = (user) => {
      this.setState({ users: this.state.users.concat(user) })
    }
  
    onDelete = (id) => {
      this.setState(prevState => ({ users: prevState.users.filter((user) => { return user.id !== id }) }))
    }
  
    render() {
      return (
        <Card.Group>
          {this.state.users.map(user => (
            <User key={user.id} id={user.id} name={user.name} email={user.email} onDelete={this.onDelete} />
          ))}
          <AddCard onAdd={this.onAdd} />
        </Card.Group>
      )
    }
  }