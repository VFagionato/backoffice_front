import { useEffect, useState } from "react";
import { Button, Form, Modal, Toast, ToastContainer } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { fetchUsers } from "../../../redux/slices/user.slices";
import { api } from "../../../services/api";

const UpdateUserModal = ({ id, onHide, show = false, funcToClose }) => {
  const [user, setUser] = useState({})
  const { register, handleSubmit, reset } = useForm()
  const dispatch = useDispatch()
  const [showToast, setShowToast] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const submit = async (data) => {
    for (const [key, value] of Object.entries(data)) {
      if (!value.length) {
        delete data[key]
      }
    }

    const response = await api.patch(`/user/${id}`, { ...data }, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    }).catch(error => {
      const { response } = error

      setShowToast(true)
      setErrorMessage(response.message)

    })

    if (!response) return

    fetchEditableUser(id)
    dispatch(fetchUsers())
    reset()
    funcToClose(false)

  }

  const fetchEditableUser = async (id) => {
    const response = await api.get(`/user/${id}`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    }).catch(error => false)

    if (!response) return

    const { data } = response

    setUser({ ...data.user.props })
  }

  const createFields = (user) => {
    return Object.entries(user).filter(element => {
      const [name] = element
      const bannedFields = {
        createdAt: '',
        updatedAt: '',
      }
      if (bannedFields.hasOwnProperty(name)) {
        return false
      }
      return true
    })
  }

  const defineType = (keyName) => {
    const types = {
      email: 'email',
      password: 'password'
    }

    if (types[keyName]) {
      return types[keyName]
    }

    return
  }

  useEffect(() => {
    fetchEditableUser(id)
  }, [id])

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Update user: {id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(submit)}>
          {createFields(user).map((element, index) => {
            const [name, value] = element
            return (
              <Form.Group className='mb-2' key={index}>
                <Form.Label>{name[0].toUpperCase() + name.slice(1)}</Form.Label>
                <Form.Control
                  type={defineType(name)}
                  placeholder={name === 'password' ? 'new password' : value}
                  {...register(name)}
                />
              </Form.Group>
            )
          })}
          <Button variant="primary" type='submite'>
            Submit
          </Button>
        </Form>
      </Modal.Body>
      <ToastContainer className="p-3" position="top-start">
        <Toast show={showToast} onClose={() => setShowToast(false)}>
          <Toast.Header closeButton>
            Error
          </Toast.Header>
          <Toast.Body>{errorMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Modal>
  )
}

export default UpdateUserModal