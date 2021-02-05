import { Card } from 'semantic-ui-react'
import UserPlaceholder from '../cards/Loading'

export const Placeholders = () => (
    <Card.Group>
      {[...Array(4).keys()].map(x => (
        <UserPlaceholder key={x.toString()}/>
      ))}
    </Card.Group>
  )