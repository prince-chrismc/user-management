import { Message, Icon } from 'semantic-ui-react'

const ErrorMessage = ({ message }) => (
    <Message icon error>
        <Icon name='cancel' />
        <Message.Content>
            <Message.Header>Oh no! Something went horribly wrong</Message.Header>
            <p>Error: {message}</p>
        </Message.Content>
    </Message>
)

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired
}

export default ErrorMessage
