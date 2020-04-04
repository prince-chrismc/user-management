import React from 'react';
import { Link } from 'react-router-dom';
import { Header, Container, Divider, Icon, Menu } from 'semantic-ui-react';

import { pullRight, h1 } from './layout.css';

const Layout = ({ children }) => {
  return (
    <Container>
      <Link to="/">
        <Header as="h1" className={h1}>
          React From C++
        </Header>
      </Link>
      <Menu>
        <Menu.Item as={Link} to="/">
          Home
        </Menu.Item>
        <Menu.Item as={Link} to="/dynamic">
          Dynamic
        </Menu.Item>
        <Menu.Item as={Link} to="/cards">
          Cards
        </Menu.Item>
      </Menu>
      {children}
      <Divider />
      <p className={pullRight}>
        Made with <Icon name="heart" color="red" /> by Chris Mc
      </p>
    </Container>
  );
};

export default Layout;
