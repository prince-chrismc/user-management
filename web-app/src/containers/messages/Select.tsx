import { FunctionComponent } from 'react'

import { Message } from "../../core/models/Message";
import PendingMessage from './Pending'
import SuccessMessage from './Success'
import ErrorMessage from './Error'

interface SelectMessageProps {
  success?: Message,
  loading?: Message,
  error?: Message,
}

const SelectMessage: FunctionComponent<SelectMessageProps> = ({ success, loading, error }) => {
  return (
    <>
      { loading && <PendingMessage message={loading.message} />}
      { error && <ErrorMessage message={error.message} />}
      { success && <SuccessMessage message={success.message} />}
    </>
  )
}

export default SelectMessage
