import { useState } from "react"
import { useAsync } from "react-async"
import { Button, Message } from 'semantic-ui-react'

import PopupModal from '../../containers/PopupModal'
import UserForm from '../forms/User'
import PendingMessage from '../messages/Pending'
import { AddUser } from '../../core/services/List'

const ShowMessages = ({ isFulfilled, isPending, error }) => {
  return (
    <>
      { isPending && <PendingMessage message='Currently proccessing add of new user' />}
      { error && <Message error header='Oh no! Something went horribly wrong' content={'Error: ' + error.message} />}
      { isFulfilled && <Message success header='Success! The operation completed without any issue' content='The user was successfully added' />}
    </>
  )
}

const CreateUser = ({ onAdd }) => {
  const [isSubmitting, setSubmmiting] = useState(false)
  const user = { id: 0, name: "John Doe", email: "john@example.com" }
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
