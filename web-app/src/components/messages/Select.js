import PendingMessage from './Pending'
import SuccessMessage from './Success'
import ErrorMessage from './Error'

const SelectMessage = ({ success, loading, error }) => {
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
    }),
}

export default SelectMessage