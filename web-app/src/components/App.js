import React from 'react'
import { Message, Icon, Card, Container } from 'semantic-ui-react'
import { useAsync } from 'react-async'
import regeneratorRuntime from 'regenerator-runtime' // required for async

import Layout from './Layout'
import User from './cards/Display'
import AddCard from './cards/Add'
import UserPlaceholder from './cards/Loading'
import { LoadUsers } from './endpoints/List'

const MakeCards = ({ users }) => (
  <Card.Group>
    {users.map(user => (
      <User id={user.id} name={user.name} email={user.email} />
    ))}
    <AddCard />
  </Card.Group>
)

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
      <Container>
        <Message icon>
          <Icon name='circle notched' loading />
          <Message.Content>
            <Message.Header>Just one second</Message.Header>
            We are fetching that content for you.
          </Message.Content>
        </Message>
        <MakePlaceholders />
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <Message negative>
          <Message.Header>Oh no! Something went wrong. Please Submit an issue to our support team.</Message.Header>
          <p>{error.message}</p>
        </Message>
        <MakePlaceholders />
      </Container>
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
