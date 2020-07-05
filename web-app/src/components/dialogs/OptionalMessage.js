import React, { Component } from 'react';

const withErrorHandling = ({ showError, message }) => {
   return (
      <div>
         {showError && message}
      </div>
   );
};

const DivWithErrorHandling = withErrorHandling

class OptionalMessage extends Component {
   state = { isVisible: this.props.isVisible }

   render() {
      const { isVisible } = this.state

      return (
         <DivWithErrorHandling
            showError={isVisible}
            message={this.props.children} />
      );
   }
}

export default OptionalMessage;