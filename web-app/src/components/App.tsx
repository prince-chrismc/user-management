import { useAsync } from 'react-async'

import { LoadUsers } from '../core/services/List'
import { Placeholders } from './decks/Placeholders'
import MakeCards from './decks/Individuals'
import Layout from '../containers/layout/Layout'
import ErrorMessage from '../containers/messages/Error'
import PendingMessage from '../containers/messages/Pending'

const EditUsers = () => {
  const { data, error, isLoading } = useAsync({ promiseFn: LoadUsers })

  if (isLoading) {
    return (
      <>
        <PendingMessage message={'We are fetching that content for you.'} />
        <Placeholders />
      </>
    )
  }

  if (error) {
    return (
      <ErrorMessage message={error.message} />
    )
  }

  if (data) {
    return (
      <MakeCards users={data} />
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
