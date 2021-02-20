import { FunctionComponent } from 'react'
import PropTypes from 'prop-types'

import { Message } from '../../core/models/Message'
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

SelectMessage.propTypes = {
  success: PropTypes.shape({
    message: PropTypes.string.isRequired
  }),
  loading: PropTypes.shape({
    message: PropTypes.string.isRequired
  }),
  error: PropTypes.shape({
    message: PropTypes.string.isRequired
  })
}

export default SelectMessage
