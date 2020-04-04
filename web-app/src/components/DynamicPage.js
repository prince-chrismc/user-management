import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from 'semantic-ui-react';

import Layout from './Layout';

const DynamicPage = () => {
  return (
    <Layout>
      <Header as="h2">Dynamic Page</Header>
      <p>This page was loaded asynchronously!!!</p>
      <Link to="/">Navigate to Home Page</Link>
    </Layout>
  );
};

export default DynamicPage;
