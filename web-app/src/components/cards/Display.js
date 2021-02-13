import { useState, useEffect } from 'react'
import { Card, Button } from 'semantic-ui-react'

import ModifyUser from '../operations/Edit'
import RemoveUser from '../operations/Delete'

const User = ({ user, onDelete }) => {
  const [u, setUser] = useState(user)
  useEffect(() => { setUser(user) }, [user])

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
        <Card.Header>{u.name}</Card.Header>
        <Card.Meta>{u.email}</Card.Meta>
      </Card.Content>
      <Card.Content extra>
        <Button.Group widths='2'>
          <ModifyUser id={u.id} name={u.name} email={u.email} onChange={onChange} />
          <Button.Or />
          <RemoveUser id={u.id} name={u.name} email={u.email} onDelete={() => onDelete(u.id)} />
        </Button.Group>
      </Card.Content>
    </Card>
  )
}

User.propTypes = {
  user: PropTypes.exact({
    id: PropTypes.number,
    name: PropTypes.string,
    email: PropTypes.string
  }).isRequired,
  onDelete: PropTypes.func
}

export default User
