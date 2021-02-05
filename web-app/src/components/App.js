import { Message, Icon } from 'semantic-ui-react'
import { useAsync } from 'react-async'
import importedComponent from 'react-imported-component'

import Layout from './Layout'
import { LoadUsers } from '../core/services/List'

const AsyncPlaceholders = importedComponent(
  () => import(/* webpackChunkName:'Placeholders' */ './decks/Placeholders')
)

const AsyncMakeCards = importedComponent(
  () => import(/* webpackChunkName:'MakeCards' */ './decks/Individuals'),
  {
    LoadingComponent: AsyncPlaceholders
  }
)

const EditUsers = () => {
  const { data, error, isLoading } = useAsync({ promiseFn: LoadUsers })

  if (isLoading) {
    return (
      <>
        <Message icon>
          <Icon name='circle notched' loading />
          <Message.Content>
            <Message.Header>Just one second</Message.Header>
            We are fetching that content for you.
          </Message.Content>
        </Message>
        <AsyncPlaceholders />
      </>
    )
  }

  if (error) {
    return (
      <>
        <Message negative>
          <Message.Header>Oh no! Something went wrong. Please Submit an issue to our support team.</Message.Header>
          <p>{error.message}</p>
        </Message>
        <AsyncPlaceholders />
      </>
    )
  }

  if (data) {
    return (
      <AsyncMakeCards users={data} />
    )
  }
}

const App = () => {
  return (
    <Layout>
      <EditUsers />
    </Layout>
  )
}

export default App
