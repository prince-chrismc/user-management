import { useState } from 'react'
import { Modal } from 'semantic-ui-react'

const PopupModal = ({ button, header, children, onClose }) => {
  const [open, setOpen] = useState(false)
  const doClose = () => {
    onClose()
    setOpen(false)
  }

  return (
    <>
      <button.type {...button.props} onClick={() => setOpen(true)} />
      <Modal open={open} onClose={doClose} closeIcon >
        <Modal.Header>{header}</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            {children}
          </Modal.Description>
        </Modal.Content>
      </Modal>
    </>
  )
}

PopupModal.propTypes = {
  button: PropTypes.element.isRequired,
  header: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  onClose: PropTypes.func.isRequired
}

export default PopupModal
