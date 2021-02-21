import { useState } from 'react'
import { useAsync } from 'react-async'
import PropTypes from 'prop-types'
import { Button } from 'semantic-ui-react'

import PopupModal from '../../containers/PopupModal'
import ConfirmForm from '../forms/Confirm'
import SelectMessage from '../../containers/messages/Select'
import WarningMessage from '../../containers/messages/Warning'
import { DeleteUser } from '../../core/services/User'
import { Etag } from '../../core/tools/Etag'

const ShowMessages = ({ isFulfilled, isPending, error }) => {
  const success = isFulfilled ? { message: 'The user was successfully deleted' } : null
  const loading = isPending ? { message: 'Currently proccessing delete of user' } : null
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

const RemoveUser = ({ user, onDelete }) => {
  const [isSubmitting, setSubmmiting] = useState(false)
  const { isFulfilled, isPending, error, run, cancel } = useAsync({
    deferFn: DeleteUser, onResolve: () => { onDelete() }
  })

  const handleSubmit = () => {
    setSubmmiting(true)

    const etag = Etag(user.id, user.name, user.email)
    run(user.id, etag)
  }

  const doClose = () => {
    cancel()
    setSubmmiting(false)
  }

  return (
    <PopupModal button={<Button color='red' content='Delete' icon='user cancel' labelPosition='right' floated='right' />}
      header='Delete User' onClose={doClose}>

      {isSubmitting && <ShowMessages isFulfilled={isFulfilled} isPending={isPending} error={error} />}
      {!isSubmitting && <WarningMessage message={'You are about to delete "' + user.name + '". Are you sure about that?'} />}

      <ConfirmForm handleSubmit={handleSubmit} disabled={isSubmitting} />
    </PopupModal>
  )
}

RemoveUser.propTypes = {
  user: PropTypes.exact({
    id: PropTypes.number,
    name: PropTypes.string,
    email: PropTypes.string
  }).isRequired,
  onDelete: PropTypes.func.isRequired
}

export default RemoveUser
