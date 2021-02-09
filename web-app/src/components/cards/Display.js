import { useState, useEffect } from 'react'
import { Card, Button } from 'semantic-ui-react'

import ModifyUser from '../operations/Edit'
import RemoveUser from '../operations/Delete'

const User = props => {
  const [user, setUser] = useState(props.user)

  useEffect(() => {
    setUser(props.user)
  }, [props.user])

  const onChange = (name, email) => {
    setUser(prevState => ({
      ...prevState,
      name: name,
      email: email
    }))
  }

  return (
    <Card color='grey'>
      <Card.Content>
        <Card.Header>
          {user.name}
        </Card.Header>
        <Card.Meta>
          {user.email}
        </Card.Meta>
      </Card.Content>
      <Card.Content extra>
        <Button.Group widths='2'>
          <ModifyUser id={user.id} name={user.name} email={user.email} onChange={onChange} />
          <Button.Or />
          <RemoveUser id={user.id} name={user.name} email={user.email} onDelete={() => props.onDelete(user.id)} />
        </Button.Group>
      </Card.Content>
    </Card>
  )
}

export default User
