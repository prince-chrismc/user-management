import { Message, Icon } from 'semantic-ui-react'

const WarningMessage = ({ message }) => (
    <Message icon warning>
        <Icon name='warning sign' />
        <Message.Content>
            <Message.Header>The action you are about to perform is dangerous!</Message.Header>
            {message}
        </Message.Content>
    </Message>
)

WarningMessage.propTypes = {
    message: PropTypes.string.isRequired
}

export default WarningMessage
