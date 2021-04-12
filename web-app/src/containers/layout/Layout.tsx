import PropTypes from 'prop-types'
import Clock from 'react-live-clock'
import { Header, Container, Divider, Icon, Grid } from 'semantic-ui-react'

import { pullRight, h1 } from './layout.scss'

const Layout = ({ children }) => {
  return (
    <Container>
      <Header className={h1}>
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column>
              Users Management <sup>v{process.env.VERSION}</sup>
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

Layout.propTypes = {
  children: PropTypes.element.isRequired
}

export default Layout
