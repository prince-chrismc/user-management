import React from 'react';
import { Header, Card } from 'semantic-ui-react';

import Layout from './Layout';
import User from './User';

const EditUsers = () => {
  return (
    <Layout>
      <Header as="h2">Users Management Page</Header>
      <Card.Group>
        <User />
        <User />
        <User />
      </Card.Group>
    </Layout>
  );
};

export default EditUsers;
