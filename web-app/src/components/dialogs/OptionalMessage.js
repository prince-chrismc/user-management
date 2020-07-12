import React, { Component } from 'react';

const withErrorHandling = ({ showError, message }) => {
   return (
      <span>
         {showError && message}
      </span>
   );
};

const SpanWithErrorHandling = withErrorHandling

class OptionalMessage extends Component {
   render() {
      return (
         <SpanWithErrorHandling
            showError={this.props.isVisible}
            message={this.props.children} />
      );
   }
}

export default OptionalMessage;
