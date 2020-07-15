import React from 'react'

const OptionalMessage = ({ isVisible, children }) => {
  if (isVisible) {
    return (
      <>
        {children}
      </>
    )
  }

  return (null)
}

export default OptionalMessage
