import React from 'react';
import { Card } from 'semantic-ui-react';

import ModalModalExample from './Module'

const Item = () => {
  return (
    <div>
      <ModalModalExample />
      <Card>
        <Card.Content>
          <Card.Header>Item</Card.Header>
          <Card.Description>
            Generic description
        </Card.Description>
        </Card.Content>
      </Card>
    </div>
  );
};

export default Item;
