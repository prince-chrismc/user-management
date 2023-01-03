import { Card, Button, Placeholder } from 'semantic-ui-react'

const UserPlaceholder = () => (
  <Card color='orange'>
    <Card.Content>
      <Placeholder>
        <Placeholder.Header image>
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder.Header>
        <Placeholder.Paragraph>
          <Placeholder.Line length='medium' />
          <Placeholder.Line length='short' />
        </Placeholder.Paragraph>
      </Placeholder>
    </Card.Content>
    <Card.Content extra>
      <Button content='Edit' icon='edit outline' labelPosition='left' floated='left' disabled />
      <Button color='red' content='Delete' icon='user cancel' labelPosition='right' floated='right' disabled />
    </Card.Content>
  </Card>
)

export default UserPlaceholder
