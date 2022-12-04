import { useState } from 'react'
import { useAsync } from 'react-async'
import PropTypes from 'prop-types'
import { Button } from 'semantic-ui-react'

import PopupModal from '../../containers/PopupModal'
import UserForm from '../forms/User'
import SelectMessage from '../../containers/messages/Select'
import { AddUser } from '../../core/services/List'

const ShowMessages = ({ isFulfilled, isPending, error }) => {
  const success = isFulfilled ? { message: 'The user was successfully added' } : null
  const loading = isPending ? { message: 'Currently proccessing add of new user' } : null
  return (
    <SelectMessage success={success} loading={loading} error={error} />
  )
}

ShowMessages.propTypes = {
  isFulfilled: PropTypes.bool.isRequired,
  isPending: PropTypes.bool.isRequired,
  error: PropTypes.shape({
    message: PropTypes.string.isRequired
  })
}

const CreateUser = ({ onAdd }) => {
  const [isSubmitting, setSubmmiting] = useState(false)
  const user = { id: 0, name: 'John Doe', email: 'john@example.com' }
  const { isFulfilled, isPending, error, run, cancel } = useAsync({ deferFn: AddUser, onResolve: onAdd })

  const handleSubmit = (name, email) => {
    setSubmmiting(true)
    run(name, email)
  }

  const doClose = () => {
    cancel()
    setSubmmiting(false)
  }

  return (
    <PopupModal button={<Button content='Add' icon='user outline' labelPosition='left' color='green' />}
      header='Add New User' onClose={doClose}>

      {isSubmitting && <ShowMessages isFulfilled={isFulfilled} isPending={isPending} error={error} />}

      <UserForm user={user} handleSubmit={handleSubmit} disabled={isSubmitting} />
    </PopupModal>
  )
}

CreateUser.propTypes = {
  onAdd: PropTypes.func.isRequired
}

export default CreateUser
