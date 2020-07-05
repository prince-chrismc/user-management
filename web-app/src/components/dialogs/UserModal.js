import React, { Component } from 'react';
import { Button, Modal } from 'semantic-ui-react'

class PopupModal extends Component {
   state = { open: false }
   open = () => this.setState({ open: true })
   close = () => this.setState({ open: false })

   render() {
      const { open } = this.state

      return (
         <span>
            <Button content={this.props.content} icon={this.props.icon}
               labelPosition={this.props.labelPosition} color={this.props.color}
               onClick={this.open} />
            <Modal open={open}
               onClose={this.close}
               closeIcon>
               <Modal.Header>{this.props.header}</Modal.Header>
               <Modal.Content>
                  <Modal.Description>
                     {this.props.children}
                  </Modal.Description>
               </Modal.Content>
            </Modal>
         </span>
      )
   }
}

export default PopupModal;
