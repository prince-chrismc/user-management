import React from 'react';
import { Header, Card, Container } from 'semantic-ui-react';
import { useAsync } from 'react-async';
import regeneratorRuntime from "regenerator-runtime"; // required for async

import Layout from './Layout';
import User from './User/Display';
import AddUser from './User/Add';

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

const EditUsers = () => {
  const { data, error, isLoading } = useAsync({ promiseFn: loadUsers })
  if (isLoading)
  return (
    <Layout>
      <Header as="h2">Users Management Page</Header>
      <Container>
        <p>
          Loading please wait...
        </p>
      </Container>
    </Layout>
  );

  if (error)
    return (
      <Layout>
        <Header as="h2">Users Management Page</Header>
        <Container>
          <p>
            Something went wrong: {error.message}
          </p>
        </Container>
      </Layout>
    );

  if (data)
    return (
      <Layout>
        <Header as="h2">Users Management Page</Header>
        <MakeCards users={data} />
      </Layout>
    );
};

const App = () => {
  return (
    <EditUsers />
  );
};

export default App;
