import React, { Component } from 'react'
import { Form } from 'semantic-ui-react'

class FormEditNameAndEmail extends Component {
  state = { name: this.props.name, email: this.props.email }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  render() {
    const { name, email } = this.state

    return (
      <Form onSubmit={() => { this.props.handleSubmit(this.state.name, this.state.email) }}
        success={this.props.success}
        eroor={this.props.error}
      >
        {this.props.children}
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
          <Form.Button color='green' icon='check' content='Save' inverted
            disabled={this.props.success || this.props.error} />
        </Form.Group>
      </Form>
    )
  }
}

export default FormEditNameAndEmail
