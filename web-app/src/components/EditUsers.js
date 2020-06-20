import React from 'react';
import { Header, Card } from 'semantic-ui-react';

import Layout from './Layout';
import User from './User';

const MakeCards = ({ users }) => (
  <Card.Group>
    {users.map(user => (
      <User name={user.name} email={user.email} />
    ))}
  </Card.Group>
);

const EditUsers = () => {
  var users = [
    { id: 0, name: "John Doe", email: "john@example.com" },
    { id: 1, name: "Jane Doe", email: "jane@example.com" },
    { id: 2, name: "Jack Doe", email: "jack@example.com" }
  ]

  return (
    <Layout>
      <Header as="h2">Users Management Page</Header>
      <MakeCards users={users} />
    </Layout>
  );
};

export default EditUsers;
