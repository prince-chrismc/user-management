import { Message, Icon } from 'semantic-ui-react'

const SuccessMessage = ({ message }) => (
    <Message icon success>
        <Icon name='check' />
        <Message.Content>
            <Message.Header>Success! The operation was completed without any issue</Message.Header>
            {message}
        </Message.Content>
    </Message>
)

SuccessMessage.propTypes = {
    message: PropTypes.string.isRequired
}

export default SuccessMessage
