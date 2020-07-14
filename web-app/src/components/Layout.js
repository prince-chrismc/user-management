import React from 'react'
import Clock from 'react-live-clock'
import { Header, Container, Divider, Icon, Grid } from 'semantic-ui-react'

import { pullRight, h1 } from './layout.css'

const Layout = ({ children }) => {
  return (
    <Container>
      <Header as="h1" className={h1}>
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column>
              Users Management
            </Grid.Column>
            <Grid.Column>
              <span className={pullRight}>
                <Clock format={'HH:mm:ss'} ticking={true} timezone={'Etc/UTC'} />
              </span>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Header>
      {children}
      <Divider />
      <p className={pullRight}>
        Made with <Icon name="heart" color="red" /> by Chris Mc
      </p>
    </Container>
  )
}

export default Layout
