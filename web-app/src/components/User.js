import React, { Component } from 'react';
import { Card, Button, Modal, Form } from 'semantic-ui-react'

class FormEditNameAndEmail extends Component {
  state = { name: this.props.name, email: this.props.email }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  render() {
    const { name, email } = this.state

    return (
      <Form onSubmit={() => { this.props.handleSubmit(this.state.name, this.state.email) }}>
        <Form.Group>
          <Form.Input
            placeholder='Name'
            name='name'
            value={name}
            onChange={this.handleChange}
          />
          <Form.Input
            placeholder='Email'
            name='email'
            value={email}
            onChange={this.handleChange}
          />
          <Form.Button color='green' icon='check' content='Save' inverted />
        </Form.Group>
      </Form>
    )
  }
}

class User extends Component {
  state = { name: this.props.name, email: this.props.email }

  handleSubmit = (name, email) => {
    this.setState({ name: name, email: email })
  }

  render() {
    const { name, email } = this.state
    return (
      <Card>
        <Card.Content>
          <Card.Header>
            {name}
          </Card.Header>
          <Card.Meta>
            {email}
          </Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <Modal trigger={<Button content='Edit' icon='edit outline' labelPosition='left' />} closeIcon>
            <Modal.Header>Edit Settings</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <FormEditNameAndEmail
                  name={this.state.name}
                  email={this.state.email}
                  handleSubmit={this.handleSubmit}
                />
              </Modal.Description>
            </Modal.Content>
          </Modal>
        </Card.Content>
      </Card>
    )
  }
}

export default User;
