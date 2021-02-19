import { Form } from 'semantic-ui-react'

const ConfirmForm = ({ handleSubmit, disabled }) => (
    <Form onSubmit={handleSubmit} >
        <Form.Button color='red' icon='warning' content='Confirm' fluid inverted disabled={disabled} />
    </Form>
)

ConfirmForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  disabled: PropTypes.bool
}

export default ConfirmForm
