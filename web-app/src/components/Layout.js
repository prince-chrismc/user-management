import React from 'react';
import { Header, Container, Divider, Icon } from 'semantic-ui-react';

import { pullRight, h1 } from './layout.css';

const Layout = ({ children }) => {
  return (
    <Container>
        <Header as="h1" className={h1}>
          React From C++
        </Header>
      {children}
      <Divider />
      <p className={pullRight}>
        Made with <Icon name="heart" color="red" /> by Chris Mc
      </p>
    </Container>
  );
};

export default Layout;
