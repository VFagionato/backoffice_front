import { useState } from "react"
import { Button, Form, Modal, ToastContainer, Toast } from "react-bootstrap"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { fetchUsers } from "../../../redux/slices/user.slices"
import { api } from "../../../services/api"

const CreateUserModal = ({ onHide, show, funcToClose }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const dispatch = useDispatch()
  const [showToast, setShowToast] = useState(false)
  const [errorTitle, setErrorTitle] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const fields = [
    {
      type: 'text',
      label: 'name',
      placeholder: 'First name',
    },
    {
      type: 'password',
      label: 'password',
      placeholder: 'create a password',
    },
    {
      type: 'email',
      label: 'email',
      placeholder: 'new@mail.com',
    },
    {
      type: 'number',
      label: 'phone',
      placeholder: '99999999999',
    },
    {
      type: 'number',
      label: 'permission',
      placeholder: '0 = user | 1 = admin',
    },

  ]

  const submit = async (data) => {
    data.permission = Number(data.permission)
    const response = await api.post('/user', data, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    }).catch(error => {
      const { response } = error

      setShowToast(true)
      setErrorTitle(`${response.status}: ${response.statusText}`)
      setErrorMessage(response.data.message)
      setTimeout(() => {
        setShowToast(false)
      }, 3000)
    })

    if (!response) return

    dispatch(fetchUsers())
    funcToClose(false)
    reset()
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Creating a new user</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(submit)}>
          {fields.map((item, index) => (
            <Form.Group className='mb-2' key={index}>
              <Form.Label>{item.label[0].toUpperCase() + item.label.slice(1)}</Form.Label>
              <Form.Control
                type={item.type}
                placeholder={item.placeholder}
                {...register(item.label, { required: true })}
              />
              {errors[item.label]?.type === 'required' && <p> * {item.label} is required</p>}
            </Form.Group>
          ))}
          <Button variant="primary" type='submite'>
            Submit
          </Button>
        </Form>
      </Modal.Body>
      <ToastContainer className="p-3" position="top-start">
        <Toast show={showToast} onClose={() => setShowToast(false)}>
          <Toast.Header closeButton>
            Error {errorTitle}
          </Toast.Header>
          <Toast.Body>{errorMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Modal>
  )
}

export default CreateUserModal