import PropTypes from 'prop-types'
import { Message, Icon } from 'semantic-ui-react'

const PendingMessage = ({ message }) => (
    <Message icon>
        <Icon name='circle notched' loading />
        <Message.Content>
            <Message.Header>Just one second</Message.Header>
            {message}
        </Message.Content>
    </Message>
)

PendingMessage.propTypes = {
  message: PropTypes.string.isRequired
}

export default PendingMessage
