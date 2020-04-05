import React from 'react';
import { Card } from 'semantic-ui-react';

import ModalModalExample from './Module'

const Item = () => {
  return (
    <Card>
      <Card.Content>
        <Card.Header>Item</Card.Header>
        <Card.Description>
          Generic description
        </Card.Description>
        <Card.Description>
          <ModalModalExample />
        </Card.Description>
      </Card.Content>
    </Card>
  );
};

export default Item;
