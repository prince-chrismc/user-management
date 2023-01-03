import { useState, useEffect } from 'react'
import { useAsync } from 'react-async'
import PropTypes from 'prop-types'
import { Button } from 'semantic-ui-react'

import PopupModal from '../../containers/PopupModal'
import UserForm from '../forms/User'
import SelectMessage from '../../containers/messages/Select'
import { EditUser } from '../../core/services/User'
import { Etag } from '../../core/tools/Etag'

const ShowMessages = ({ isFulfilled, isPending, error }) => {
  const success = isFulfilled ? { message: 'The user was successfully modified' } : null
  const loading = isPending ? { message: 'Currently proccessing edit of user' } : null
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

const ModifyUser = ({ user, onChange }) => {
  const [isSubmitting, setSubmmiting] = useState(false)
  const [u, setUser] = useState(user)
  useEffect(() => { setUser(user) }, [user])
  const { isFulfilled, isPending, error, run, cancel } = useAsync({
    deferFn: EditUser,
    onResolve: (data) => {
      setUser(prevState => ({ ...prevState, name: data.name, email: data.email }))
      onChange(data.name, data.email)
    }
  })

  const handleSubmit = (name, email) => {
    setSubmmiting(true)

    const etag = Etag(u.id, u.name, u.email)
    run(u.id, name, email, etag)
  }

  const doClose = () => {
    cancel()
    setSubmmiting(false)
  }

  return (
    <PopupModal button={<Button content='Edit' icon='edit outline' labelPosition='left' floated='left' />}
      header='Edit Settings' onClose={doClose}>

      {isSubmitting && <ShowMessages isFulfilled={isFulfilled} isPending={isPending} error={error} />}

      <UserForm user={u} handleSubmit={handleSubmit} disabled={isSubmitting} />
    </PopupModal>
  )
}

ModifyUser.propTypes = {
  user: PropTypes.exact({
    id: PropTypes.number,
    name: PropTypes.string,
    email: PropTypes.string
  }).isRequired,
  onChange: PropTypes.func.isRequired
}

export default ModifyUser
