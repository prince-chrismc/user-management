import React from 'react';
import { Message, Icon, Header, Card, Container } from 'semantic-ui-react';
import { useAsync } from 'react-async';
import regeneratorRuntime from "regenerator-runtime"; // required for async

import Layout from './Layout';
import User from './User/Display';
import AddUser from './User/Add';
import UserPlaceholder from './User/Loading';

const loadUsers = async () =>
  await fetch("https://localhost:8080/um/v1/users")
    .then(res => (res.ok ? res : Promise.reject(res)))
    .then(res => res.json())

const MakeCards = ({ users }) => (
  <Card.Group>
    {users.map(user => (
      <User name={user.name} email={user.email} />
    ))}
    <AddUser />
  </Card.Group>
);

const MakePlaceholders = () => (
  <Card.Group>
    {[...Array(3).keys()].map(x => (
      <UserPlaceholder />

    ))}
  </Card.Group>
);

const EditUsers = () => {
  const { data, error, isLoading } = useAsync({ promiseFn: loadUsers })

  if (isLoading)
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
    );

  if (error)
    return (
      <Container>
        <Message negative>
          <Message.Header>Oh no! Something went wrong. Please Submit an issue to our support team.</Message.Header>
          <p>{error.message}</p>
        </Message>
        <MakePlaceholders />
      </Container>
    );

  if (data)
    return (
      <MakeCards users={data} />
    );
};

const App = () => {
  return (
    <Layout>
      <Header as="h2">Users Management Page</Header>
      <EditUsers />
    </Layout>
  );
};

export default App;
