import { useState, useEffect } from 'react'
import { Card } from 'semantic-ui-react'

import User from '../cards/Display'
import AddCard from '../cards/Add'

const MakeCards = ({ users }) => {
  const [list, setList] = useState(users)
  useEffect(() => { setList(users) }, [users])

  const onAdd = (user) => { setList(prevState => [...prevState, user]) }

  const onDelete = (id) => {
    const newList = list.filter((user) => { return user.id !== id })
    setList(newList)
  }

  return (
    <Card.Group>
      {list.map(user => <User key={user.id} user={user} onDelete={onDelete} />)}
      <AddCard onAdd={onAdd} />
    </Card.Group>
  )
}

MakeCards.propTypes = {
  users: PropTypes.arrayOf(PropTypes.exact({
    id: PropTypes.number,
    name: PropTypes.string,
    email: PropTypes.string
  }))
}

export default MakeCards
