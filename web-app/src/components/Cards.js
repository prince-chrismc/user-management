import React from 'react';
import { Header, Grid } from 'semantic-ui-react';

import Layout from './Layout';
import Item from './Item';

const CardsPage = () => {
  return (
    <Layout>
      <Header as="h2">Cards Page</Header>
      <Grid stackable columns={3}>
        <Grid.Row>
          <Grid.Column>
            <Item />
          </Grid.Column>
          <Grid.Column>
            <Item />
          </Grid.Column>
          <Grid.Column>
            <Item />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Item />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Layout>
  );
};

export default CardsPage;
