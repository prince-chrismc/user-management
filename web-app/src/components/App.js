import { Component } from 'react'
import { Message, Icon, Card } from 'semantic-ui-react'
import { useAsync } from 'react-async'
import importedComponent from 'react-imported-component';

import Layout from './Layout'
import UserPlaceholder from './cards/Loading'
import { LoadUsers } from './endpoints/List'

const AsyncUser = importedComponent(
  () => import(/* webpackChunkName:'UserCard' */ './cards/Display'),
  {
    LoadingComponent: UserPlaceholder
  }
);

const AsyncAddCard = importedComponent(
  () => import(/* webpackChunkName:'AddCard' */ './cards/Add'),
  {
    LoadingComponent: UserPlaceholder
  }
);

class MakeCards extends Component {
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
          <AsyncUser id={user.id} name={user.name} email={user.email} onDelete={this.onDelete} />
        ))}
        <AsyncAddCard onAdd={this.onAdd} />
      </Card.Group>
    )
  }
}

const MakePlaceholders = () => (
  <Card.Group>
    {[...Array(4).keys()].map(x => (
      <UserPlaceholder />
    ))}
  </Card.Group>
)

const EditUsers = () => {
  const { data, error, isLoading } = useAsync({ promiseFn: LoadUsers })

  if (isLoading) {
    return (
      <>
        <Message icon>
          <Icon name='circle notched' loading />
          <Message.Content>
            <Message.Header>Just one second</Message.Header>
            We are fetching that content for you.
          </Message.Content>
        </Message>
        <MakePlaceholders />
      </>
    )
  }

  if (error) {
    return (
      <>
        <Message negative>
          <Message.Header>Oh no! Something went wrong. Please Submit an issue to our support team.</Message.Header>
          <p>{error.message}</p>
        </Message>
        <MakePlaceholders />
      </>
    )
  }

  if (data) {
    return (
      <MakeCards users={data} />
    )
  }
}

const App = () => {
  return (
    <Layout>
      <EditUsers />
    </Layout>
  )
}

export default App
