import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';

const withErrorHandling = ({ showError, message }) => {
   return (
      <Container>
         {showError && message}
      </Container>
   );
};

const ContainerWithErrorHandling = withErrorHandling

class OptionalMessage extends Component {
   render() {
      return (
         <ContainerWithErrorHandling
            showError={this.props.isVisible}
            message={this.props.children} />
      );
   }
}

export default OptionalMessage;
